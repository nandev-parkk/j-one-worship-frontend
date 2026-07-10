import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/Pagination';
import { PerformanceVideoCard } from '@/components/ui/PerformanceVideoCard';
import {
  useListYouTubeVideos,
  useListUsersForFilter,
} from '@/hooks/useYouTubeVideos';
import { useRemovePerformanceYouTubeVideo } from '@/hooks/usePerformances';
import { useSearchParams } from 'react-router';

const DEFAULT_LIMIT = 6;

interface PerformanceRegisteredVideosProps {
  performanceId: number;
}

export const PerformanceRegisteredVideos: React.FC<PerformanceRegisteredVideosProps> = ({
  performanceId,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('rvpage')) || 1;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  // Debounce search 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setSearchParams((prev) => {
      prev.set('rvpage', '1');
      return prev;
    });
  }, [debouncedSearch, userId]);

  // Set page via query string
  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        prev.set('rvpage', String(newPage));
        return prev;
      });
    },
    [],
  );

  // Fetch registered videos for this performance
  const videoParams = useMemo(
    () => ({
      performanceId,
      page,
      limit: DEFAULT_LIMIT,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(userId ? { userId } : {}),
    }),
    [page, debouncedSearch, performanceId, userId],
  );

  const { data, isLoading, isError } = useListYouTubeVideos(videoParams);

  // User filter options
  const { data: users = [] } = useListUsersForFilter();

  // Unregister mutation
  const unregisterMutation = useRemovePerformanceYouTubeVideo();

  const videos = data?.data ?? [];
  const meta = useMemo(() => {
    if (!data?.meta) return undefined;
    return { ...data.meta, page };
  }, [data?.meta, page]);

  const handleUnregister = useCallback(
    (videoId: number) => {
      unregisterMutation.mutate({ performanceId, videoId });
    },
    [performanceId, unregisterMutation],
  );

  if (isLoading)
    return (
      <div className="text-sm text-[#A9A9A9]">
        로딩 중...
      </div>
    );

  if (isError)
    return (
      <div className="text-sm text-[#EF4444]">
        영상 목록을 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <div className="relative w-full sm:w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9A9A9]"
          />
          <Input
            placeholder="영상명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm placeholder:text-gray-400"
          />
        </div>
        <Select
          value={userId == null ? '' : String(userId)}
          onValueChange={(value) => {
            setUserId(value ? Number(value) : null);
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm data-[placeholder]:text-gray-400">
            <SelectValue placeholder="업로더" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">전체</SelectItem>
            {users.map((option) => (
              <SelectItem key={option.id} value={String(option.id)}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Card Grid */}
      {videos.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#A9A9A9]">
          등록된 영상이 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <PerformanceVideoCard
                key={video.id}
                video={video}
                onUnregister={handleUnregister}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <Pagination meta={meta} onPageChange={setPage} />
          )}
        </>
      )}

    </div>
  );
};
