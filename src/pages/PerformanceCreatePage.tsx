import { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { createPerformanceSchema, type CreatePerformanceInput } from '@/lib/performance-schema';
import { useCreatePerformance } from '@/hooks/usePerformances';
import { useAuthStore } from '@/stores';

const statusOptions: { value: string; label: string }[] = [
  { value: 'upcoming', label: '예정' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
];


export const PerformanceCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createPerformance, isPending } = useCreatePerformance();
  const user = useAuthStore((state) => state.user);

  // admin이 아닌 경우 목록 페이지로 리다이렉트
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/performances', { replace: true });
    }
  }, [user, navigate]);

  // admin이 아니면 렌더링 생략
  if (user?.role !== 'admin') {
    return null;
  }

  const [fieldError, setFieldError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('09:00:00');
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePerformanceInput>({
    resolver: zodResolver(createPerformanceSchema),
    defaultValues: {
      name: '',
      description: '',
      datetime: '',
      location: '',
      status: 'upcoming',
    },
  });

  // 설명 자릿수 카운터
  const descriptionValue = useWatch({ control, name: 'description' }) as string ?? '';

  // 날짜/시간 선택 시 datetime 필드 업데이트
  useEffect(() => {
    if (selectedDate) {
      setValue('datetime', format(selectedDate, 'yyyy-MM-dd') + 'T' + selectedTime);
    }
  }, [selectedDate, selectedTime, setValue]);

  const onSubmit = (data: CreatePerformanceInput) => {
    const payload: CreatePerformanceInput = {
      ...data,
      datetime: !data.datetime && selectedDate
        ? format(selectedDate, 'yyyy-MM-dd') + 'T' + selectedTime
        : data.datetime,
    };
    createPerformance(payload, {
      onSuccess: () => {
        navigate('/performances');
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
        } else if ((axiosError.response?.status ?? 0) >= 500) {
          setFieldError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
        } else {
          setFieldError('공연 생성에 실패했습니다. 다시 시도해 주세요.')
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-6 py-6">
        {/* Back Icon + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/performances')}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-[#333333]" />
          </button>
          <h1 className="text-2xl font-bold text-[#222222]">
            공연 생성
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-5"
          noValidate
        >
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

          {/* Datetime + Status — one row */}
          <div className="flex flex-col sm:flex-row gap-4">
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
                        {format(selectedDate, 'yyyy-MM-dd')}{' '}
                        <span>{selectedTime}</span>
                      </>
                    ) : (
                      <span>날짜를 선택해주세요.</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 max-w-[95vw]" align="start" collisionPadding={8}>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                    }}
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
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
                생성 중…
              </span>
            ) : (
              '공연 생성'
            )}
          </Button>
        </form>
    </div>
  );
};
