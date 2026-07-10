import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { MainLayout } from '@/components/ui/MainLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, LayoutGrid, List, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { YouTubeVideoCard } from '@/components/ui/YouTubeVideoCard';
import { YouTubeVideoTable } from '@/components/ui/YouTubeVideoTable';
import { YouTubeVideoPreview } from '@/components/ui/YouTubeVideoPreview';
import { YouTubeVideoFilters } from '@/components/ui/YouTubeVideoFilters';
import {
  useListYouTubeVideos,
  useRegisterYouTubeVideo,
  useDeleteYouTubeVideo,
  useListPerformancesForFilter,
  useListUsersForFilter,
} from '@/hooks/useYouTubeVideos';
import type { PaginationMeta } from '@/lib/performance-types';
import { useAuthStore } from '@/stores';

const DEFAULT_LIMIT = 12;

// ─── Pagination ────────────────────────────────────────────────

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages } = meta;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        if (pages.length > 0) {
          const last = pages[pages.length - 1];
          if (last !== 'ellipsis' && typeof last === 'number' && i - last > 1) {
            pages.push('ellipsis');
          }
        }
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="이전 페이지"
      >
        <ChevronLeft size={16} />
      </Button>

      {getPageNumbers().map((p, idx) =>
        p === 'ellipsis' ? (
          <button
            key={`ellipsis-${idx}`}
            disabled
            className="inline-flex h-9 w-9 items-center justify-center rounded-md"
            aria-hidden="true"
          >
            <MoreHorizontal size={16} />
          </button>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(p)}
            aria-label={`페이지 ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="다음 페이지"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
// ─── Main Page ─────────────────────────────────────────────────

export const YouTubeVideoListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        prev.set('page', String(newPage));
        return prev;
      });
    },
    [setSearchParams],
  );

  const [search, setSearch] = useState('');
  const [performanceId, setPerformanceId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isPending, isError, isFetching } = useListYouTubeVideos({
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch || undefined,
    performanceId,
    userId,
  });

  const registerMutation = useRegisterYouTubeVideo();
  const deleteMutation = useDeleteYouTubeVideo();

  const { data: performances } = useListPerformancesForFilter();
  const { data: users } = useListUsersForFilter();

  const handleFilterChange = useCallback(
    (newSearch: string, newPerformanceId: number | null, newUserId: number | null) => {
      setPage(1);
      setSearch(newSearch);
      setPerformanceId(newPerformanceId);
      setUserId(newUserId);
    },
    [setPage],
  );

  const items = data?.data ?? [];
  const meta = data?.meta;

  const handleRegisterVideo = useCallback(
    (videoId: string) => {
      registerMutation.mutate({ videoId }, {
        onSuccess: () => {
          setRegisterError(null);
          setShowAddDialog(false);
        },
        onError: (error) => {
          const serverMessage = error.response?.data?.error?.message;
          if (serverMessage) {
            setRegisterError(serverMessage);
            return;
          }
          if (!error.response) {
            setRegisterError('네트워크 연결을 확인해 주세요.');
          } else if (error.response.status >= 500) {
            setRegisterError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
          } else {
            setRegisterError('영상 등록에 실패했습니다. 다시 시도해 주세요.');
          }
        },
      });
    },
    [registerMutation],
  );

  const handleDeleteRequest = useCallback((id: number) => {
    setDeleteConfirmId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId === null) return;
    deleteMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  }, [deleteConfirmId, deleteMutation]);

  const canDelete = useCallback(
    (videoId: number) => {
      if (!user) return false;
      const video = items.find((v) => v.id === videoId);
      if (!video) return false;
      if (user.role === 'admin') return true;
      return video.createdBy === user.id;
    },
    [user, items],
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 w-full px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: '#222222' }}>
            YouTube 영상 목록
          </h2>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="h-9 text-sm font-medium rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #2977DC, #6A9DE0)',
            }}
          >
            <Plus size={16} />
            영상 등록
          </Button>
        </div>

        <YouTubeVideoFilters
          search={search}
          performanceId={performanceId}
          userId={userId}
          performances={performances ?? []}
          users={users ?? []}
          onChange={handleFilterChange}
        />

        {isPending ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center" style={{ color: '#EF4444' }}>
            데이터를 불러오지 못했습니다.
          </div>
        ) : items.length === 0 && !isFetching ? (
          <div className="flex flex-1 items-center justify-center" style={{ color: '#A9A9A9' }}>
            영상이 없습니다.
          </div>
        ) : items.length === 0 && isFetching ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'card' | 'table')}>
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="card">
                  <LayoutGrid size={14} />
                  카드
                </TabsTrigger>
                <TabsTrigger value="table">
                  <List size={14} />
                  테이블
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="card">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((video) => (
                  <YouTubeVideoCard
                    key={video.id}
                    video={video}
                    canDelete={canDelete(video.id)}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table">
              <YouTubeVideoTable
                videos={items}
                onDelete={handleDeleteRequest}
                currentUserRole={user?.role ?? 'user'}
                currentUserId={user?.id ?? 0}
              />
            </TabsContent>
          </Tabs>
        )}

        {meta && meta.total > 0 && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {/* Add Video Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        if (!open) setRegisterError(null);
        setShowAddDialog(open);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>영상 등록</DialogTitle>
          </DialogHeader>
          <YouTubeVideoPreview
            youtubeUrl=""
            onClear={() => { setShowAddDialog(false); setRegisterError(null); }}
            onSave={handleRegisterVideo}
            loading={registerMutation.isPending}
            error={registerError ?? undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>영상 삭제</DialogTitle>
          </DialogHeader>
          <p style={{ color: '#5A5A5A' }}>정말로 이 영상을 삭제하시겠습니까?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};
