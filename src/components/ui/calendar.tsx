'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { getYear, getMonth } from 'date-fns'
import { ko } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

function CustomNav(props: Parameters<typeof import('react-day-picker').Nav>[0]) {
  const { onPreviousClick, onNextClick, previousMonth, nextMonth } = props
  const currentMonth = nextMonth
    ? new Date(nextMonth.getFullYear(), nextMonth.getMonth() - 1, 1)
    : previousMonth
      ? new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1)
      : new Date()

  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPreviousClick}
          disabled={!previousMonth}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-8 w-8 p-0 select-none aria-disabled:opacity-50',
          )}
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium select-none">
          {getYear(currentMonth)}년 {getMonth(currentMonth) + 1}월
        </span>
        <button
          type="button"
          onClick={onNextClick}
          disabled={!nextMonth}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-8 w-8 p-0 select-none aria-disabled:opacity-50',
          )}
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function TimeInput({ value, onChange }: { value?: string; onChange?: (time: string) => void }) {
  const [period, setPeriod] = React.useState<'오전' | '오후'>('오전')
  const [hour, setHour] = React.useState('')
  const [minute, setMinute] = React.useState('')
  const [second, setSecond] = React.useState('')
  const hourRef = React.useRef<HTMLInputElement>(null)
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)

  // value prop (HH:mm:ss) 변경 시 3개 field state로 분할
  React.useEffect(() => {
    if (!value) {
      setHour('')
      setMinute('')
      setSecond('')
      setPeriod('오전')
      return
    }
    const parts = value.split(':')
    let h = parseInt(parts[0], 10)
    const m = parts[1] ?? '00'
    const s = parts[2] ?? '00'
    const p = h >= 12 ? '오후' : '오전'

    if (p === '오후' && h !== 12) h -= 12
    if (p === '오전' && h === 0) h = 12

    setPeriod(p)
    setHour(String(h).padStart(2, '0'))
    setMinute(m)
    setSecond(s)
  }, [value])

  // 3개 field 모두 2자리 채워졌을 때만 onChange 호출
  React.useEffect(() => {
    if (hour.length === 2 && minute.length === 2 && second.length === 2) {
      const h = parseInt(hour, 10)
      const m = Math.min(parseInt(minute, 10), 59)
      const s = Math.min(parseInt(second, 10), 59)

      let hour24 = h
      if (period === '오후' && hour24 !== 12) hour24 += 12
      if (period === '오전' && hour24 === 12) hour24 = 0

      onChange?.(
        `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      )
    }
  }, [hour, minute, second, period, onChange])

  // 개별 필드 입력 처리
  const formatField = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    _field: 'hour' | 'minute' | 'second',
    nextRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    const digits = value.replace(/\D/g, '').slice(0, 2)
    setter(digits)

    if (digits.length === 2 && nextRef?.current) {
      nextRef.current.focus()
      nextRef.current.select()
    }
  }

  // 필드별 표시 포맷
  const maskField = (field: string): string => {
    if (field.length === 0) return '--'
    return field
  }

  // 오전/오후 토글 시 onChange 호출 (3개 field 모두 채워져 있을 경우)
  const handlePeriodChange = (newPeriod: '오전' | '오후') => {
    setPeriod(newPeriod)
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex rounded-md border border-input overflow-hidden">
        <button
          type="button"
          onClick={() => handlePeriodChange('오전')}
          className={cn(
            'px-2 py-1 text-xs font-medium transition-colors min-w-[40px] sm:min-w-[44px]',
            period === '오전' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
          )}
        >
          오전
        </button>
        <button
          type="button"
          onClick={() => handlePeriodChange('오후')}
          className={cn(
            'px-2 py-1 text-xs font-medium transition-colors border-l border-input min-w-[40px] sm:min-w-[44px]',
            period === '오후' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
          )}
        >
          오후
        </button>
      </div>
      <div className="flex items-center">
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={maskField(hour)}
          onChange={(e) => formatField(e.target.value, setHour, 'hour', minuteRef)}
          onFocus={(e) => (e.target as HTMLInputElement).select()}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="w-[26px] sm:w-[28px] h-9 text-center text-sm bg-transparent rounded-md border border-input shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <span className="text-sm px-0.5 select-none">:</span>
        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={maskField(minute)}
          onChange={(e) => formatField(e.target.value, setMinute, 'minute', secondRef)}
          onFocus={(e) => (e.target as HTMLInputElement).select()}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="w-[26px] sm:w-[28px] h-9 text-center text-sm bg-transparent rounded-md border border-input shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <span className="text-sm px-0.5 select-none">:</span>
        <input
          ref={secondRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={maskField(second)}
          onChange={(e) => formatField(e.target.value, setSecond, 'second')}
          onFocus={(e) => (e.target as HTMLInputElement).select()}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="w-[26px] sm:w-[28px] h-9 text-center text-sm bg-transparent rounded-md border border-input shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
  )
}
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showTimePicker = false,
  time,
  onTimeChange,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  showTimePicker?: boolean;
  time?: string;
  onTimeChange?: (time: string) => void;
}) {
  return (
    showTimePicker ? (
      <div className={cn('rounded-lg', className)}>
        <DayPicker
          showOutsideDays={showOutsideDays}
          className="p-3"
          locale={ko}
          classNames={{
            weekdays: 'flex justify-around',
            month_caption: 'flex justify-center items-center mb-3',
            caption_label: 'hidden',
            week: 'flex w-full mt-2',
            weekday: 'flex-1 text-black rounded-md text-[0.8rem] font-normal text-center',
            day: 'flex-1 text-center',
            day_button: cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-9 sm:w-auto p-0 m-0.5 font-normal aspect-square'),
            selected: 'rounded-full border',
            today: 'text-blue-500 font-bold',
            outside: 'text-gray-400',
            disabled: 'disabled',
            hidden: 'invisible',
            range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            range_start: 'day-range-start',
            range_end: 'day-range-end',
            ...classNames,
          }}
          components={{
            Nav: CustomNav,
            DayButton: ({ className, ...props }) => {
              const cls = (className ?? '').split(/\s+/)
              const has = (name: string) => cls.includes(name)
              return (
                <button
                  {...props}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 sm:w-auto p-0 m-0.5 font-normal aspect-square',
                    !has('outside') && !has('disabled') && 'hover:rounded-full hover:bg-gray-100',
                    has('selected') && 'rounded-full bg-gray-100',
                    has('today') && !has('selected') && 'font-bold text-blue-500',
                    (has('outside') || has('disabled')) && 'text-gray-500',
                    className,
                  )}
                />
              )
            },
            Chevron: ({ orientation, size, className }) => {
              const sizeClass = size ? `[width:${size}px] [height:${size}px]` : ''
              if (orientation === 'left')
                return <ChevronLeft className={cn('h-4 w-4', className, sizeClass)} />
              if (orientation === 'right')
                return <ChevronRight className={cn('h-4 w-4', className, sizeClass)} />
              if (orientation === 'up')
                return <ChevronLeft className={cn('h-4 w-4 -rotate-90', className, sizeClass)} />
              return <ChevronRight className={cn('h-4 w-4 -rotate-90', className, sizeClass)} />
            },
          }}
          {...props}
        />
        <div className="border-t border-t-input p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#A9A9A9]" />
            <TimeInput value={time} onChange={onTimeChange} />
          </div>
        </div>
      </div>
    ) : (
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        locale={ko}
        classNames={{
          weekdays: 'flex justify-around',
          month_caption: 'flex justify-center items-center mb-3',
          caption_label: 'hidden',
          week: 'flex w-full mt-2',
          weekday: 'flex-1 text-black rounded-md text-[0.8rem] font-normal text-center',
          day: 'flex-1 text-center',
          day_button: cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-9 sm:w-auto p-0 m-0.5 font-normal aspect-square'),
          selected: 'rounded-full border',
          today: 'text-blue-500 font-bold',
          outside: 'text-gray-400',
          disabled: 'disabled',
          hidden: 'invisible',
          range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
          range_start: 'day-range-start',
          range_end: 'day-range-end',
          ...classNames,
        }}
        components={{
          Nav: CustomNav,
          DayButton: ({ className, ...props }) => {
            const cls = (className ?? '').split(/\s+/)
            const has = (name: string) => cls.includes(name)
            return (
              <button
                {...props}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'h-9 w-9 sm:w-auto p-0 m-0.5 font-normal aspect-square',
                  !has('outside') && !has('disabled') && 'hover:rounded-full hover:bg-gray-100',
                  has('selected') && 'rounded-full bg-gray-100',
                  has('today') && !has('selected') && 'font-bold text-blue-500',
                  (has('outside') || has('disabled')) && 'text-gray-500',
                  className,
                )}
              />
            )
          },
          Chevron: ({ orientation, size, className }) => {
            const sizeClass = size ? `[width:${size}px] [height:${size}px]` : ''
            if (orientation === 'left')
              return <ChevronLeft className={cn('h-4 w-4', className, sizeClass)} />
            if (orientation === 'right')
              return <ChevronRight className={cn('h-4 w-4', className, sizeClass)} />
            if (orientation === 'up')
              return <ChevronLeft className={cn('h-4 w-4 -rotate-90', className, sizeClass)} />
            return <ChevronRight className={cn('h-4 w-4 -rotate-90', className, sizeClass)} />
          },
        }}
        {...props}
      />
    )
  )
}

export { Calendar }
