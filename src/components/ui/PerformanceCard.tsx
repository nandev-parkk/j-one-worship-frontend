import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Calendar, Clock } from 'lucide-react'
import type { Performance } from '@/lib/performance-types'

const statusLabels: Record<string, string> = {
  upcoming: '예정',
  ongoing: '진행중',
  completed: '완료',
  cancelled: '취소',
}

const statusStyles: Record<string, { bg: string; color: string }> = {
  upcoming: { bg: '#EFF6FF', color: '#2977DC' },
  ongoing: { bg: '#F0FDF4', color: '#22C55E' },
  completed: { bg: '#F5F5F5', color: '#8F8F8F' },
  cancelled: { bg: '#FEF2F2', color: '#EF4444' },
}

export const PerformanceCard: React.FC<{ performance: Performance }> = ({ performance }) => {
  const statusStyle = statusStyles[performance.status] ?? statusStyles.upcoming
  const statusLabel = statusLabels[performance.status] ?? performance.status

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

  return (
    <Link to={`/performances/${performance.id}`} className="flex flex-col">
      <Card
        className="flex flex-col flex-1 min-w-0 min-h-[18rem] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--card-shadow)] hover:border-[var(--card-hover-color)]"
        style={{
          '--card-hover-color': statusStyle.color,
          '--card-shadow': `0 10px 15px -3px ${statusStyle.color}26, 0 4px 6px -4px ${statusStyle.color}26`,
        } as React.CSSProperties}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1" style={{ color: '#222222' }}>
              {performance.name}
            </CardTitle>
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {statusLabel}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 flex-1">
          {performance.description && (
            <p className="text-sm overflow-y-auto max-h-[2.5rem]" style={{ color: '#5A5A5A' }}>
              {performance.description}
            </p>
          )}
          <div className="mt-auto flex flex-col gap-2 text-sm" style={{ color: '#5A5A5A' }}>
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: '#A9A9A9' }} />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: '#A9A9A9' }} />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: '#A9A9A9' }} />
              <span>{performance.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
