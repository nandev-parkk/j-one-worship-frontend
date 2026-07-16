import { useState, useMemo, useCallback, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar as CalendarIcon, Plus, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useListSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule, useGetSchedule } from '@/hooks/useSchedules'
import { useGetMe } from '@/hooks/useUsers'
import type { CalendarSchedule, ScheduleItem } from '@/lib/schedule-types'

type PanelMode = 'idle' | 'create' | 'view' | 'edit'

export const ScheduleListPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [panelMode, setPanelMode] = useState<PanelMode>('idle')
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null)

  const monthStr = format(currentMonth, 'yyyy-MM')
  const { data: schedules, isPending } = useListSchedules({ month: monthStr })
  const { data: user } = useGetMe()
  const isAdmin = user?.role === 'admin'

  // Detail query for selected schedule
  const { data: scheduleDetail } = useGetSchedule(selectedScheduleId ?? 0, {
    enabled: selectedScheduleId != null && (panelMode === 'view' || panelMode === 'edit'),
  })

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')
  const [formIsAllDay, setFormIsAllDay] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Mutations
  const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule()
  const { mutate: updateSchedule, isPending: isUpdating } = useUpdateSchedule()
  const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteSchedule()

  // Group schedules by date for calendar display
  const schedulesByDate = useMemo(() => {
    const map = new Map<string, CalendarSchedule[]>()
    schedules?.forEach((s) => {
      const dateKey = format(parseISO(s.start), 'yyyy-MM-dd')
      const existing = map.get(dateKey) ?? []
      existing.push(s)
      map.set(dateKey, existing)
    })
    return map
  }, [schedules])

  // Schedules for selected date
  const selectedDateSchedules = useMemo(() => {
    if (!selectedDate) return []
    const key = format(selectedDate, 'yyyy-MM-dd')
    return schedulesByDate.get(key) ?? []
  }, [selectedDate, schedulesByDate])

  // Open create panel
  const openCreatePanel = useCallback(
    (date: Date) => {
      setSelectedDate(date)
      setFormTitle('')
      setFormDescription('')
      setFormIsAllDay(false)
      setFormStartDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).toISOString())
      setFormEndDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 0, 0).toISOString())
      setFormErrors({})
      setSelectedScheduleId(null)
      setPanelMode('create')
    },
    [],
  )

  // Open view panel
  const openViewPanel = useCallback((schedule: CalendarSchedule) => {
    setSelectedScheduleId(schedule.id)
    setPanelMode('view')
  }, [])

  // Open edit panel - pre-fill form from schedule data immediately
  const openEditPanel = useCallback((schedule: CalendarSchedule | ScheduleItem) => {
    const isCal = 'allDay' in schedule
    const title = schedule.title
    const desc = schedule.description ?? ''
    const allDay = isCal ? schedule.allDay : schedule.isAllDay
    const startTime = isCal ? schedule.start : (schedule.startDate as unknown as string)
    const endTime = isCal ? schedule.end : (schedule.endDate as unknown as string)

    setFormTitle(title)
    setFormDescription(desc)
    setFormIsAllDay(allDay)
    setFormStartDate(startTime)
    setFormEndDate(endTime)
    setFormErrors({})
    setPanelMode('edit')
  }, [])

  // Close panel
  const closePanel = useCallback(() => {
    setPanelMode('idle')
    setSelectedScheduleId(null)
    setFormErrors({})
  }, [])

  // Validate form
  const validateForm = useCallback((isCreate: boolean): boolean => {
    const errors: Record<string, string> = {}

    if (!formTitle.trim()) {
      errors.title = '일정 이름을 입력해주세요.'
    } else if (formTitle.length > 20) {
      errors.title = '이름은 20자를 초과할 수 없습니다.'
    }
    if (isCreate && !formStartDate) {
      errors.startDate = '시작일시를 입력해주세요.'
    }
    if (isCreate && !formEndDate) {
      errors.endDate = '종료일시를 입력해주세요.'
    }
    if (formStartDate && formEndDate && new Date(formStartDate) > new Date(formEndDate)) {
      errors.endDate = '종료일시는 시작일시 이후여야 합니다.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formTitle, formStartDate, formEndDate])

  // Submit create
  const handleCreate = useCallback(() => {
    if (!validateForm(true)) return
    createSchedule({
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      startDate: formStartDate,
      endDate: formEndDate,
      isAllDay: formIsAllDay,
    })
    closePanel()
  }, [formTitle, formDescription, formStartDate, formEndDate, formIsAllDay, validateForm, createSchedule, closePanel])

  // Submit update
  const handleUpdate = useCallback(() => {
    if (!selectedScheduleId) return
    const input: Record<string, string | boolean> = {}
    if (formTitle !== '') input.title = formTitle.trim()
    if (formDescription !== undefined) input.description = formDescription.trim()
    if (formStartDate) input.startDate = formStartDate
    if (formEndDate) input.endDate = formEndDate
    input.isAllDay = formIsAllDay

    updateSchedule({ id: selectedScheduleId, input })
    closePanel()
  }, [selectedScheduleId, formTitle, formDescription, formStartDate, formEndDate, formIsAllDay, updateSchedule, closePanel])

  // Delete
  const handleDelete = useCallback(() => {
    if (!selectedScheduleId) return
    deleteSchedule(selectedScheduleId)
    closePanel()
  }, [selectedScheduleId, deleteSchedule, closePanel])

  // Navigate months
  const prevMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    setSelectedDate(undefined)
  }, [currentMonth])

  const nextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    setSelectedDate(undefined)
  }, [currentMonth])

  // Day cells for custom calendar
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    return eachDayOfInterval({ start: monthStart, end: monthEnd })
  }, [currentMonth])

  // Determine which schedule to display in panel
  const displaySchedule = useMemo(() => {
    if (!selectedScheduleId) return null
    // Use scheduleDetail if available, otherwise find from calendar list
    if (scheduleDetail) return scheduleDetail
    const calSchedule = schedules?.find((s) => s.id === selectedScheduleId)
    return calSchedule ?? null
  }, [selectedScheduleId, scheduleDetail, schedules])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full px-4 py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#2977DC]" />
          <h1 className="text-xl font-semibold text-[#2D2D2D]">스케줄 관리</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-[#5A5A5A]" />
              </button>
              <h2 className="text-lg font-medium text-[#2D2D2D]">
                {format(currentMonth, 'yyyy년 MM월', { locale: ko })}
              </h2>
              <button
                onClick={nextMonth}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-[#5A5A5A]" />
              </button>
            </div>

            <div className="border-t border-l border-[#F0F0F0]">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-0">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-[#8F8F8F] py-2 border-r border-b border-[#F0F0F0]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-24 sm:h-28 border-r border-b border-[#F0F0F0] bg-[#FAFAFA]" />
                ))}

                {days.map((day) => {
                  const dayKey = format(day, 'yyyy-MM-dd')
                  const daySchedules = schedulesByDate.get(dayKey) ?? []
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())
                  const isCurrentMonth = isSameMonth(day, currentMonth)

                  return (
                    <div
                      key={dayKey}
                      className={`
                        relative h-24 sm:h-28 border-r border-b border-[#F0F0F0] p-1 cursor-pointer transition-colors group
                        ${isSelected ? 'bg-[#E8F2FD]' : 'hover:bg-[#F8F8F8]'}
                        ${!isCurrentMonth ? 'bg-[#FAFAFA]' : ''}
                      `}
                      onClick={() => setSelectedDate(day)}
                      onDoubleClick={() => openCreatePanel(day)}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm ${
                            isToday
                              ? 'font-bold text-[#2977DC]'
                              : isCurrentMonth
                                ? 'text-[#2D2D2D]'
                                : 'text-[#BFBFBF]'
                          }`}
                        >
                          {format(day, 'd')}
                        </span>
                        {isAdmin !== false && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openCreatePanel(day)
                            }}
                            className="p-0.5 rounded hover:bg-[#D0E5FC] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="일정 추가"
                          >
                            <Plus className="h-3.5 w-3.5 text-[#2977DC]" />
                          </button>
                        )}
                      </div>

                      {/* Schedule indicators */}
                      <div className="mt-1 space-y-0.5 overflow-hidden">
                        {daySchedules.slice(0, 3).map((s) => (
                          <div
                            key={s.id}
                            className="text-[10px] sm:text-xs truncate px-2 py-0.5 rounded bg-[#5A5A5A] text-white cursor-pointer hover:bg-[#8F8F8F] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              openViewPanel(s)
                            }}
                          >
                            {s.title}
                          </div>
                        ))}
                        {daySchedules.length > 3 && (
                          <div className="text-[10px] text-[#8F8F8F] px-1">
                            +{daySchedules.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected date schedules sidebar */}
        {selectedDate && (
          <div className="w-full lg:w-72 bg-white rounded-lg border border-[#E5E5E5] p-4 flex flex-col max-h-[calc(100vh-200px)]">
            <h3 className="text-sm font-medium text-[#2D2D2D] mb-3 shrink-0">
              {format(selectedDate, 'yyyy.MM.dd (EEEE)', { locale: ko })}
            </h3>

            <div className="flex-1 overflow-y-auto min-h-0">
              {selectedDateSchedules.length === 0 ? (
                <p className="text-sm text-[#8F8F8F]">일정이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {selectedDateSchedules.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg border border-[#E5E5E5] cursor-pointer hover:border-[#2977DC] transition-colors"
                      onClick={() => openViewPanel(s)}
                    >
                      <div className="text-sm font-medium text-[#2D2D2D]">{s.title}</div>
                      <div className="text-xs text-[#8F8F8F] mt-1">
                        {s.allDay ? '종일' : `${format(parseISO(s.start), 'a h:mm')} - ${format(parseISO(s.end), 'a h:mm')}`}
                      </div>
                      {s.description && (
                        <div className="text-xs text-[#5A5A5A] mt-1">{s.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => openCreatePanel(selectedDate)}
              className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#E5E5E5] text-sm text-[#5A5A5A] hover:bg-[#F8F8F8] transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" />
              일정 추가
            </button>
          </div>
        )}
      </div>

      {/* Slide-over Panel */}
      <DialogPrimitive.Root open={panelMode !== 'idle'} onOpenChange={(isOpen) => !isOpen && closePanel()}>
        <SlideOverPanel
          mode={panelMode}
          onClose={closePanel}
          scheduleDetail={scheduleDetail ?? displaySchedule}
          selectedDate={selectedDate}
          formTitle={formTitle}
          formDescription={formDescription}
          formStartDate={formStartDate}
          formEndDate={formEndDate}
          formIsAllDay={formIsAllDay}
          onTitleChange={setFormTitle}
          onDescriptionChange={setFormDescription}
          onStartDateChange={setFormStartDate}
          onEndDateChange={setFormEndDate}
          onIsAllDayChange={setFormIsAllDay}
          formErrors={formErrors}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onEdit={() => displaySchedule && openEditPanel(displaySchedule)}
          onDelete={handleDelete}
          isCreating={isCreating}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          isAdmin={isAdmin ?? false}
        />
      </DialogPrimitive.Root>
    </div>
  )
}

/* ──────────────────────────── Slide-over Panel ──────────────────────────── */

interface SlideOverPanelProps {
  mode: PanelMode
  onClose: () => void
  scheduleDetail: CalendarSchedule | ScheduleItem | null
  selectedDate: Date | undefined
  formTitle: string
  formDescription: string
  formStartDate: string
  formEndDate: string
  formIsAllDay: boolean
  onTitleChange: (val: string) => void
  onDescriptionChange: (val: string) => void
  onStartDateChange: (val: string) => void
  onEndDateChange: (val: string) => void
  onIsAllDayChange: (val: boolean) => void
  formErrors: Record<string, string>
  onCreate: () => void
  onUpdate: () => void
  onEdit: () => void
  onDelete: () => void
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  isAdmin: boolean
}

function SlideOverPanel({
  mode,
  onClose,
  scheduleDetail,
  selectedDate,
  formTitle,
  formDescription,
  formStartDate,
  formEndDate,
  formIsAllDay,
  onTitleChange,
  onDescriptionChange,
  onStartDateChange,
  onEndDateChange,
  onIsAllDayChange,
  formErrors,
  onCreate,
  onUpdate,
  onEdit,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
  isAdmin,
}: SlideOverPanelProps) {
  if (mode === 'idle') return null

  const title = mode === 'create' ? '일정 생성' : mode === 'edit' ? '일정 수정' : '일정 상세'
  const showForm = mode === 'create' || mode === 'edit'

  // ─── Date/time picker state ───
  const extractDate = (val: string) => {
    if (!val) return null
    const d = new Date(val)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const extractTime = (val: string) => {
    if (!val) return ''
    const d = new Date(val)
    return Number.isNaN(d.getTime()) ? '' : format(d, 'HH:mm:ss')
  }

  const [startDate, setStartDate] = useState<Date | null>(extractDate(formStartDate))
  const [startTime, setStartTime] = useState<string>(extractTime(formStartDate))
  const [endDate, setEndDate] = useState<Date | null>(extractDate(formEndDate))
  const [endTime, setEndTime] = useState<string>(extractTime(formEndDate))

  // Sync parent formStartDate → local date/time state
  useEffect(() => {
    setStartDate(extractDate(formStartDate))
    setStartTime(extractTime(formStartDate))
  }, [formStartDate])

  useEffect(() => {
    setEndDate(extractDate(formEndDate))
    setEndTime(extractTime(formEndDate))
  }, [formEndDate])

  // Combine date + time → ISO 8601 UTC string (e.g. 2026-07-15T01:00:00.000Z)
  const combineDateTime = (date: Date | null, time: string) => {
    if (!date || !time) return ''
    const [h, m, s] = time.split(':').map(Number)
    const combined = new Date(date)
    combined.setHours(h, m, s, 0)
    return combined.toISOString()
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
      onStartDateChange(combineDateTime(date, startTime || '00:00:00'))
    }
  }

  const handleStartTimeChange = (time: string) => {
    setStartTime(time)
    if (startDate) onStartDateChange(combineDateTime(startDate, time))
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date)
      onEndDateChange(combineDateTime(date, endTime || '00:00:00'))
    }
  }

  const handleEndTimeChange = (time: string) => {
    setEndTime(time)
    if (endDate) onEndDateChange(combineDateTime(endDate, time))
  }
  const formatTimeDisplay = (time: string) => {
    if (!time) return ''
    try {
      return format(new Date(`2000-01-01T${time}`), 'hh:mm a', { locale: ko })
    } catch {
      return time
    }
  }

  // Helper to format schedule detail for display
  const displayTitle = scheduleDetail ? ('title' in scheduleDetail ? scheduleDetail.title : '-') : '-'
  const displayDescription = scheduleDetail
    ? 'description' in scheduleDetail
      ? (scheduleDetail as CalendarSchedule).description ?? '-'
      : (scheduleDetail as ScheduleItem).description ?? '-'
    : '-'
  const displayAllDay = scheduleDetail
    ? 'isAllDay' in scheduleDetail
      ? (scheduleDetail as ScheduleItem).isAllDay
      : (scheduleDetail as CalendarSchedule).allDay
    : false
  const displayStart = scheduleDetail
    ? 'startDate' in scheduleDetail
      ? format(new Date((scheduleDetail as ScheduleItem).startDate), 'yyyy.MM.dd hh:mm a', { locale: ko })
      : format(parseISO((scheduleDetail as CalendarSchedule).start), 'yyyy.MM.dd hh:mm a', { locale: ko })
    : '-'
  const displayEnd = scheduleDetail
    ? 'endDate' in scheduleDetail
      ? format(new Date((scheduleDetail as ScheduleItem).endDate), 'yyyy.MM.dd hh:mm a', { locale: ko })
      : format(parseISO((scheduleDetail as CalendarSchedule).end), 'yyyy.MM.dd hh:mm a', { locale: ko })
    : '-'

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 bg-black/30 z-40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="text-lg font-semibold text-[#2D2D2D]">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-[#8F8F8F]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {showForm ? (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="schedule-title" className="text-sm font-medium text-[#2D2D2D]">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="schedule-title"
                  value={formTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="일정 이름을 입력하세요"
                  maxLength={20}
                  className={`mt-1 ${formErrors.title ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50' : ''}`}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>
                )}
                <p className="text-xs text-[#8F8F8F] mt-1">{formTitle.length}/20</p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="schedule-desc" className="text-sm font-medium text-[#2D2D2D]">
                  설명
                </Label>
                <Textarea
                  id="schedule-desc"
                  value={formDescription}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="설명을 입력하세요 (선택)"
                  maxLength={100}
                  className="mt-1 resize-none"
                  rows={3}
                />
                <p className="text-xs text-[#8F8F8F] mt-1">{formDescription.length}/100</p>
              </div>

              {/* All day switch */}
              <div className="flex items-center justify-between">
                <Label htmlFor="schedule-allday" className="text-sm font-medium text-[#2D2D2D]">
                  종일 일정
                </Label>
                <Switch
                  id="schedule-allday"
                  checked={formIsAllDay}
                  onCheckedChange={onIsAllDayChange}
                />
              </div>

              {/* Date fields */}
              {!formIsAllDay && (
                <>
                  <div>
                    <Label htmlFor="schedule-start" className="text-sm font-medium text-[#2D2D2D]">
                      시작 일시 <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left font-normal mt-1 h-auto py-2 px-3 ${
                            !startDate ? 'text-gray-400' : ''
                          } ${formErrors.startDate ? 'border-red-500' : ''}`}
                        >
                          <CalendarIcon size={16} className="mr-2 text-[#A9A9A9]" />
                          {startDate ? (
                            format(startDate, 'yyyy-MM-dd') + ' ' + formatTimeDisplay(startTime)
                          ) : (
                            <span>일시를 선택하세요</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" collisionPadding={8}>
                        <Calendar
                          mode="single"
                          selected={startDate ?? undefined}
                          onSelect={handleStartDateSelect}
                          showTimePicker
                          time={startTime}
                          onTimeChange={handleStartTimeChange}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.startDate && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="schedule-end" className="text-sm font-medium text-[#2D2D2D]">
                      종료 일시 <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left font-normal mt-1 h-auto py-2 px-3 ${
                            !endDate ? 'text-gray-400' : ''
                          } ${formErrors.endDate ? 'border-red-500' : ''}`}
                        >
                          <CalendarIcon size={16} className="mr-2 text-[#A9A9A9]" />
                          {endDate ? (
                            format(endDate, 'yyyy-MM-dd') + ' ' + formatTimeDisplay(endTime)
                          ) : (
                            <span>일시를 선택하세요</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" collisionPadding={8}>
                        <Calendar
                          mode="single"
                          selected={endDate ?? undefined}
                          onSelect={handleEndDateSelect}
                          showTimePicker
                          time={endTime}
                          onTimeChange={handleEndTimeChange}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.endDate && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.endDate}</p>
                    )}
                  </div>
                </>
              )}

              {formIsAllDay && selectedDate && (
                <div className="text-sm text-[#5A5A5A]">
                  날짜: {format(selectedDate, 'yyyy.MM.dd (EEEE)', { locale: ko })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <div className="text-sm text-[#8F8F8F]">이름</div>
                <div className="text-base font-medium text-[#2D2D2D] mt-1">{displayTitle}</div>
              </div>

              {/* Description */}
              <div>
                <div className="text-sm text-[#8F8F8F]">설명</div>
                <div className="text-base text-[#2D2D2D] mt-1">{displayDescription}</div>
              </div>

              {/* All-day badge */}
              {displayAllDay && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <CalendarIcon size={18} className="text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">종일 일정</span>
                </div>
              )}

              {/* Date/time */}
              {!displayAllDay && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E5E5]">
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="text-xs text-[#8F8F8F]">시작</div>
                      <div className="text-sm font-medium text-[#2D2D2D] mt-0.5">{displayStart}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8F8F8F]">종료</div>
                      <div className="text-sm font-medium text-[#2D2D2D] mt-0.5">{displayEnd}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t border-[#E5E5E5] flex items-center gap-3 ${mode === 'view' && !isAdmin ? 'justify-center' : 'justify-between'}`}>
          {mode === 'view' ? (
            <>
              {isAdmin ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </Button>
                  <Button onClick={onEdit}>
                    수정
                  </Button>
                </>
              ) : null}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button
                onClick={mode === 'create' ? onCreate : onUpdate}
                disabled={mode === 'create' ? isCreating : isUpdating}
              >
                {mode === 'create' ? '생성' : '수정'}
              </Button>
            </>
          )}
        </div>
      </div>
    </DialogPrimitive.Portal>
  )
}
