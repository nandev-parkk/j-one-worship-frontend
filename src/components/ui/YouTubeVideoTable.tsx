import { useMemo } from 'react'
import { Trash2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/lib/youtube-utils'
import type { YouTubeVideo } from '@/lib/youtube-types'
import type { UserRole } from '@/lib/auth-types'

interface YouTubeVideoTableProps {
  videos: YouTubeVideo[]
  onDelete: (id: number) => void
  currentUserRole: UserRole
  currentUserId: number
}

const canDelete = (
  video: YouTubeVideo,
  currentUserRole: UserRole,
  currentUserId: number,
): boolean => {
  if (currentUserRole === 'admin') return true
  return video.createdBy === currentUserId
}

export const YouTubeVideoTable = ({
  videos,
  onDelete,
  currentUserRole,
  currentUserId,
}: YouTubeVideoTableProps) => {
  const columnHelper = useMemo(() => createColumnHelper<YouTubeVideo>(), [])

  const columns = useMemo(
    () => [
      columnHelper.accessor('thumbnailUrl', {
        header: '썸네일',
        cell: (info) => {
          const thumbnail = info.getValue()
          if (!thumbnail) return '-'
          return (
            <img
              src={thumbnail}
              alt={info.row.original.title}
              className="h-[45px] w-[80px] rounded object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  `https://img.youtube.com/vi/${info.row.original.videoId}/hqdefault.jpg`
              }}
            />
          )
        },
      }),
      columnHelper.accessor('title', {
        header: '제목',
        cell: (info) => (
          <a
            href={`https://www.youtube.com/watch?v=${info.row.original.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-[300px] items-center gap-1 text-blue-600 hover:underline"
          >
            <span className="line-clamp-2">{info.getValue()}</span>
            <ExternalLink className="shrink-0" size={14} />
          </a>
        ),
      }),
      columnHelper.accessor('channelTitle', {
        header: '채널',
        cell: (info) => <span className="line-clamp-1">{info.getValue()}</span>,
      }),
      columnHelper.accessor('duration', {
        header: '재생시간',
        cell: (info) => formatDuration(info.getValue()),
      }),
      columnHelper.accessor('creatorName', {
        header: '업로더',
        cell: (info) => <span>{info.getValue() ?? '-'}</span>,
      }),
      columnHelper.accessor('createdAt', {
        header: '등록일',
        cell: (info) => {
          return format(new Date(info.getValue()), 'yyyy-MM-dd HH:mm:ss')
        },
      }),
      columnHelper.accessor('performanceInfo', {
        header: '공연',
        cell: (info) => {
          const performances = info.getValue()
          if (!performances || performances.length === 0) {
            return <span className="text-gray-400">-</span>
          }
          return (
            <div className="flex flex-wrap gap-1">
              {performances.map((p) => (
                <Badge key={p.performanceId} variant="secondary">
                  {p.performanceName}
                </Badge>
              ))}
            </div>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '삭제',
        cell: (info) => {
          const video = info.row.original
          if (!canDelete(video, currentUserRole, currentUserId)) {
            return null
          }
          return (
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => onDelete(video.id)}
              title="삭제"
            >
              <Trash2 />
            </Button>
          )
        },
      }),
    ],
    [columnHelper, currentUserRole, currentUserId, onDelete],
  )

  const table = useReactTable({
    data: videos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[800px] whitespace-nowrap">
        <thead className="bg-muted/50 border-b-2 border-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600"
                >
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === 'function'
                      ? null
                      : (header.column.columnDef.header as React.ReactNode)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-muted/30">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm align-middle">
                  {cell.renderValue() as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
