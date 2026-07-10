import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Calendar,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Pencil,
  Video,
  X,
} from 'lucide-react'
import {
  useAddPerformanceYouTubeVideo,
  useRemovePerformanceYouTubeVideo,
} from '@/hooks/usePerformances'
import { PerformanceAllVideoList } from '@/components/ui/PerformanceAllVideoList'
import { PerformanceRegisteredVideos } from '@/components/ui/PerformanceRegisteredVideos'
import { MainLayout } from '@/components/ui/MainLayout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useGetPerformance, useUpdatePerformance } from '@/hooks/usePerformances'
import type { PerformanceStatus } from '@/lib/performance-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { updatePerformanceSchema, type UpdatePerformanceInput } from '@/lib/performance-schema'
import { useAuthStore } from '@/stores'
const statusLabels: Record<string, string> = {
  upcoming: '예정',
  ongoing: '진행중',
  completed: '완료',
  cancelled: '취소',
}

const statusStyles: Record<PerformanceStatus, { className: string }> = {
  upcoming: { className: 'bg-[#EFF6FF] text-[#2977DC]' },
  ongoing: { className: 'bg-[#F0FDF4] text-[#22C55E]' },
  completed: { className: 'bg-[#F5F5F5] text-[#8F8F8F]' },
  cancelled: { className: 'bg-[#FEF2F2] text-[#EF4444]' },
}

const statusOptions: { value: string; label: string }[] = [
  { value: 'upcoming', label: '예정' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
]

export const PerformanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const parsedId = id ? Number(id) : NaN
  const { data, isLoading, isError } = useGetPerformance(parsedId)

  const [editing, setEditing] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('09:00:00')
  const [showAllVideoList, setShowAllVideoList] = useState(true)

  const { mutate: updatePerformance, isPending } = useUpdatePerformance()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'admin'

  // Video registration/unregistration
  const addVideoMutation = useAddPerformanceYouTubeVideo()
  const removeVideoMutation = useRemovePerformanceYouTubeVideo()

  const registeredVideoIds = data?.videos.map((v) => v.id) ?? []

  const handleToggleVideo = useCallback(
    (videoId: number) => {
      if (registeredVideoIds.includes(videoId)) {
        removeVideoMutation.mutate({ performanceId: parsedId, videoId })
      } else {
        addVideoMutation.mutate({ performanceId: parsedId, videoId })
      }
    },
    [registeredVideoIds, parsedId, addVideoMutation, removeVideoMutation],
  )

  useEffect(() => {
    if (!data) return
    const date = new Date(data.datetime)
    setSelectedDate(date)
    const timeStr = date.toTimeString().substring(0, 8)
    setSelectedTime(timeStr)
  }, [data])

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePerformanceInput>({
    resolver: zodResolver(updatePerformanceSchema),
    defaultValues: {
      name: data?.name ?? '',
      description: data?.description ?? '',
      datetime: data?.datetime ?? '',
      location: data?.location ?? '',
      status: data?.status,
    },
  })

  useEffect(() => {
    if (selectedDate) {
      setValue('datetime', format(selectedDate, 'yyyy-MM-dd') + 'T' + selectedTime)
    }
  }, [selectedDate, selectedTime, setValue])

  const descriptionValue = (useWatch({ control, name: 'description' }) as string) ?? ''

  const onSubmit = (formData: UpdatePerformanceInput) => {
    const payload: UpdatePerformanceInput = {
      ...formData,
      datetime:
        !formData.datetime && selectedDate
          ? format(selectedDate, 'yyyy-MM-dd') + 'T' + selectedTime
          : formData.datetime,
    }
    updatePerformance(
      { id: parsedId, input: payload },
      {
        onSuccess: () => {
          setEditing(false)
        },
        onError: (error) => {
          const axiosError = error as {
            response?: { data?: { error?: { message?: string } }; status?: number }
          }
          const serverMessage = axiosError.response?.data?.error?.message
          if (serverMessage) {
            setFieldError(serverMessage)
            return
          }
          if (!axiosError.response) {
            setFieldError('네트워크 연결을 확인해 주세요.')
          } else if (axiosError.response.status >= 500) {
            setFieldError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
          } else {
            setFieldError('공연 수정에 실패했습니다. 다시 시도해 주세요.')
          }
        },
      },
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </MainLayout>
    )
  }

  if (isError || !data) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center gap-4 py-24">
          <div className="text-sm text-[#5A5A5A]">
            공연 정보를 불러오지 못했습니다.
          </div>
          <button
            type="button"
            onClick={() => navigate('/performances')}
            className="text-sm font-medium text-[#2977DC]"
          >
            공연 목록으로 돌아가기
          </button>
        </div>
      </MainLayout>
    )
  }

  const statusStyle = statusStyles[data.status] ?? statusStyles.upcoming
  const statusLabel = statusLabels[data.status] ?? data.status

  const date = new Date(data.datetime)
  const dateStr = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 w-full px-4 py-4 md:px-6 md:py-6">
        {/* Back Button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/performances')}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-[#333333]" />
          </button>
          <h2 className="text-xl font-bold text-[#222222]">
            공연 상세
          </h2>
        </div>

        {editing ? (
          /* 수정 모드: 폼 */
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-5" noValidate>
            {/* 취소 버튼 */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setFieldError(null)
                }}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-[#5A5A5A]" />
              </button>
            </div>

            {/* Server error alert */}
            <div
              className={`rounded-lg px-3 sm:px-4 py-3 text-sm ${fieldError ? 'visible bg-[#FDE8E8] text-[#D92020]' : 'hidden'}`}
              role="alert"
              aria-live="polite"
            >
              {fieldError}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[#333333]">
                공연명
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="공연 이름을 입력해주세요."
                className="placeholder:text-gray-400"
                disabled={isPending}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-[#D92020]" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-[#333333]">
                설명
              </Label>
              <Textarea
                id="description"
                placeholder="설명을 입력해주세요 (선택)"
                className="placeholder:text-sm placeholder:text-gray-400 min-h-[100px]"
                disabled={isPending}
                aria-invalid={!!errors.description}
                maxLength={100}
                {...register('description')}
              />
              <div className="flex justify-end text-xs text-[#A9A9A9]">
                {descriptionValue.length}/100
              </div>
              {errors.description && (
                <p className="text-xs text-[#D92020]" role="alert">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-[#333333]">
                장소
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="장소를 입력해주세요."
                className="placeholder:text-gray-400"
                disabled={isPending}
                aria-invalid={!!errors.location}
                {...register('location')}
              />
              {errors.location && (
                <p className="text-xs text-[#D92020]" role="alert">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Datetime + Status */}
            <div className="flex gap-4">
              <div className="space-y-1.5 flex-1">
                <Label className="text-[#333333]">일시</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !selectedDate ? 'text-gray-400' : ''
                      } ${errors.datetime ? 'border-[#D92020]' : ''}`}
                    >
                      <CalendarIcon size={16} className="mr-2 text-[#A9A9A9]" />
                      {selectedDate ? (
                        <>
                          {format(selectedDate, 'yyyy-MM-dd')} <span>{selectedTime}</span>
                        </>
                      ) : (
                        <span>날짜를 선택해주세요.</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date)}
                      showTimePicker
                      time={selectedTime}
                      onTimeChange={setSelectedTime}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.datetime && (
                  <p className="text-xs text-[#D92020]" role="alert">
                    {errors.datetime.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <Label className="text-[#333333]">상태</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                      <SelectTrigger className="w-full data-[placeholder]:text-gray-400">
                        <SelectValue placeholder="상태를 선택해주세요." />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-xs text-[#D92020]" role="alert">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full h-10 text-sm font-medium rounded-lg bg-gradient-to-br from-[#2977DC] to-[#6A9DE0]"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"
                    aria-hidden="true"
                  />
                  수정 중…
                </span>
              ) : (
                '공연 수정'
              )}
            </Button>
          </form>
        ) : (
          /* 보기 모드 */
          <div className="flex flex-col gap-5 w-full">
            {/* Title + Status + Edit Button */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-[#222222]">
                {data.name}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.className}`}
                >
                  {statusLabel}
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={16} className="text-[#5A5A5A]" />
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            {data.description && <p className="text-[#5A5A5A]">{data.description}</p>}

            {/* Meta Info */}
            <div className="flex flex-col gap-3 text-sm text-[#5A5A5A]">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#A9A9A9]" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#A9A9A9]" />
                <span>{timeStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#A9A9A9]" />
                <span>{data.location}</span>
              </div>
            </div>

            {/* Video Management */}
            <div className="flex flex-col gap-6 pt-2">
              <div className="flex items-center gap-2 text-base font-semibold text-[#222222]">
                <Video size={18} className="text-[#A9A9A9]" />
                <span>영상 관리</span>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {showAllVideoList && (
                  <div className="flex flex-col gap-3 w-full lg:w-[440px] lg:flex-shrink-0">
                    <h3 className="flex items-center gap-1 text-sm font-semibold text-[#5A5A5A]">
                      전체 영상 목록
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowAllVideoList(false)}
                      >
                        <ChevronDown size={14} className="text-[#A9A9A9]" />
                      </Button>
                    </h3>
                    <PerformanceAllVideoList
                      registeredVideoIds={registeredVideoIds}
                      onToggleVideo={handleToggleVideo}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3 flex-1 min-w-0 lg:flex-shrink-0">
                  {!showAllVideoList && (
                    <h3 className="flex items-center gap-1 text-sm font-semibold text-[#5A5A5A]">
                      전체 영상 목록
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowAllVideoList(true)}
                      >
                        <ChevronUp size={14} className="text-[#A9A9A9]" />
                      </Button>
                    </h3>
                    // <button
                    //   type="button"
                    //   className="flex items-center gap-1 text-sm font-semibold"
                    //   style={{ color: '#5A5A5A' }}
                    //   onClick={() => setShowAllVideoList(true)}
                    // >
                    //   전체 영상 목록
                    //   <ChevronUp size={14} style={{ color: '#A9A9A9' }} />
                    // </button>
                    // <Button
                    //   variant="ghost"
                    //   size="icon"
                    //   className="h-6 w-6"
                    //   onClick={() => setShowAllVideoList(true)}
                    // >
                    //   <ChevronUp size={14} style={{ color: '#A9A9A9' }} />
                    // </Button>
                  )}
                  <h3 className="text-sm font-semibold text-[#5A5A5A]">
                    등록한 영상
                  </h3>
                  <PerformanceRegisteredVideos performanceId={data.id} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
