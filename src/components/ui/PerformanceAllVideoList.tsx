import { useState, useEffect, useCallback } from 'react'
import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { YouTubeVideoPreview } from '@/components/ui/YouTubeVideoPreview'
import {
  useListYouTubeVideos,
  useRegisterYouTubeVideo,
  youtubeVideoKeys,
} from '@/hooks/useYouTubeVideos'
import { useQueryClient } from '@tanstack/react-query'
import { PerformanceVideoListItem } from '@/components/ui/PerformanceVideoListItem'

interface PerformanceAllVideoListProps {
  onToggleVideo: (videoId: number) => void
  registeredVideoIds: number[]
}

export const PerformanceAllVideoList: React.FC<PerformanceAllVideoListProps> = ({
  onToggleVideo,
  registeredVideoIds,
}) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  // Debounce search 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Server-side search
  const { data, isLoading } = useListYouTubeVideos({
    limit: 0,
    search: debouncedSearch || undefined,
  })
  const videos = data?.data ?? []

  // Register new video mutation
  const queryClient = useQueryClient()
  const registerMutation = useRegisterYouTubeVideo()

  const handleRegisterVideo = useCallback(
    (videoId: string) => {
      registerMutation.mutate(
        { videoId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: youtubeVideoKeys.lists })
            setShowAddDialog(false)
            setRegisterError(null)
          },
          onError: (error) => {
            const axiosError = error as {
              response?: { data?: { error?: { message?: string } }; status?: number }
            }
            const serverMessage = axiosError.response?.data?.error?.message
            setRegisterError(serverMessage ?? '영상 등록에 실패했습니다.')
          },
        },
      )
    },
    [registerMutation, queryClient],
  )

  if (isLoading) return <div className="text-sm text-[#A9A9A9]">로딩 중...</div>

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
      {/* Sticky Header */}
      <div className="top-0 z-10 bg-white flex items-center gap-2 p-3 border-b border-gray-200">
        <Search size={16} className="text-[#A9A9A9]" />
        <Input
          placeholder="곡 제목으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 border-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => {
            setShowAddDialog(true)
            setRegisterError(null)
          }}
        >
          <Plus size={16} />
        </Button>
      </div>

      <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto py-2">
        {videos.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#A9A9A9]">영상이 없습니다.</div>
        ) : (
          <div className="flex flex-col">
            {videos.map((video) => (
              <PerformanceVideoListItem
                key={video.id}
                video={video}
                registered={registeredVideoIds.includes(video.id)}
                onClick={() => onToggleVideo(video.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Video Dialog */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          if (!open) setRegisterError(null)
          setShowAddDialog(open)
        }}
      >
        <DialogContent className="max-w-[calc(100%-4rem)] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>영상 등록</DialogTitle>
          </DialogHeader>
          <YouTubeVideoPreview
            youtubeUrl=""
            onClear={() => {
              setShowAddDialog(false)
              setRegisterError(null)
            }}
            onSave={handleRegisterVideo}
            loading={registerMutation.isPending}
            error={registerError ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
