import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Calendar, Clock, MapPin, Video } from 'lucide-react'
import { MainLayout } from '@/components/ui/MainLayout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useGetPerformance } from '@/hooks/usePerformances'
import type { PerformanceStatus } from '@/lib/performance-types'

const statusLabels: Record<string, string> = {
  upcoming: '예정',
  ongoing: '진행중',
  completed: '완료',
  cancelled: '취소',
}

const statusStyles: Record<PerformanceStatus, { bg: string; color: string }> = {
  upcoming: { bg: '#EFF6FF', color: '#2977DC' },
  ongoing: { bg: '#F0FDF4', color: '#22C55E' },
  completed: { bg: '#F5F5F5', color: '#8F8F8F' },
  cancelled: { bg: '#FEF2F2', color: '#EF4444' },
}

export const PerformanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const parsedId = id ? Number(id) : NaN
  const { data, isLoading, isError } = useGetPerformance(parsedId)

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
          <div className="text-sm" style={{ color: '#5A5A5A' }}>
            공연 정보를 불러오지 못했습니다.
          </div>
          <button
            type="button"
            onClick={() => navigate('/performances')}
            className="text-sm font-medium"
            style={{ color: '#2977DC' }}
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
      <div className="flex flex-col gap-6 w-full px-6 py-6">
        {/* Back Button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/performances')}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} style={{ color: '#333333' }} />
          </button>
          <h2 className="text-xl font-bold" style={{ color: '#222222' }}>
            공연 상세
          </h2>
        </div>

        {/* Performance Info */}
        <div className="flex flex-col gap-5 w-full max-w-2xl">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold" style={{ color: '#222222' }}>
              {data.name}
            </h1>
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {statusLabel}
            </span>
          </div>

          {/* Description */}
          {data.description && (
            <p style={{ color: '#5A5A5A' }}>{data.description}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-col gap-3 text-sm" style={{ color: '#5A5A5A' }}>
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: '#A9A9A9' }} />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: '#A9A9A9' }} />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} style={{ color: '#A9A9A9' }} />
              <span>{data.location}</span>
            </div>
          </div>

          {/* Videos */}
          {data.videos.length > 0 && (
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-2 text-base font-semibold" style={{ color: '#222222' }}>
                <Video size={18} style={{ color: '#A9A9A9' }} />
                <span>YouTube 영상 ({data.videos.length})</span>
              </div>
              <div className="flex flex-col gap-4">
                {data.videos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-[#2977DC] transition-colors"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-36 h-20 rounded-md object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-sm font-medium line-clamp-2" style={{ color: '#222222' }}>
                        {video.title}
                      </span>
                      <span className="text-xs" style={{ color: '#5A5A5A' }}>
                        {video.channelTitle}
                      </span>
                      <span className="text-xs" style={{ color: '#A9A9A9' }}>
                        {video.duration}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
