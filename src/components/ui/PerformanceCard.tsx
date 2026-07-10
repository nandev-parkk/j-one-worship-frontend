import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MapPin, Calendar, Clock, Trash2 } from 'lucide-react'
import type { Performance } from '@/lib/performance-types'

const statusColors: Record<string, string> = {
  upcoming: '#2977DC',
  ongoing: '#22C55E',
  completed: '#8F8F8F',
  cancelled: '#EF4444',
}

const statusLabels: Record<string, string> = {
  upcoming: '예정',
  ongoing: '진행중',
  completed: '완료',
  cancelled: '취소',
}

const statusClasses: Record<string, string> = {
  upcoming: 'text-[#2977DC]',
  ongoing: 'text-[#22C55E]',
  completed: 'text-[#8F8F8F]',
  cancelled: 'text-[#EF4444]',
}

const statusDotClasses: Record<string, string> = {
  upcoming: 'bg-[#2977DC]',
  ongoing: 'bg-[#22C55E]',
  completed: 'bg-[#8F8F8F]',
  cancelled: 'bg-[#EF4444]',
}

export const PerformanceCard: React.FC<{
  performance: Performance
  canDelete: boolean
  onDelete: (id: number) => void
}> = ({ performance, canDelete, onDelete }) => {
  const statusColor = statusColors[performance.status] ?? statusColors.upcoming
  const statusLabel = statusLabels[performance.status] ?? statusLabels.upcoming

  const date = new Date(performance.datetime)
  const dateStr = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // min-h-[18rem]
  return (
    <Link to={`/performances/${performance.id}`} className="flex flex-col group">
      <Card
        className={cn(
          "relative flex flex-col flex-1 min-w-0 transition-all duration-200 hover:-translate-y-0.5",
          `hover:shadow-[var(--card-shadow)] hover:border-[var(--card-hover-color)]`,
          `[--card-hover-color:${statusColor}]`,
          `[--card-shadow:0_10px_15px_-3px_${statusColor}26,_0_4px_6px_-4px_${statusColor}26]`,
        )}
      >
        {canDelete && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(performance.id)
            }}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
            type="button"
          >
            <Trash2 size={14} />
          </button>
        )}
        <CardHeader>
          <span
            className={`shrink-0 flex items-center gap-1.5 text-xs ${statusClasses[performance.status] ?? statusClasses.upcoming}`}
          >
            <span className={`size-[6px] rounded-full ${statusDotClasses[performance.status] ?? statusDotClasses.upcoming}`} />
            {statusLabel}
          </span>
          <CardTitle className="line-clamp-1 text-[#222222]">
            {performance.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 flex-1">
          {/*{performance.description && (*/}
          {/*  */}
          {/*)}*/}
          <p className="text-sm overflow-y-auto min-h-[2rem] max-h-[2.5rem] text-[#5A5A5A]">
            {performance.description}
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#5A5A5A]">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#A9A9A9]" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#A9A9A9]" />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#A9A9A9]" />
              <span>{performance.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
