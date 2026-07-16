import { useState, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PerformanceCard } from '@/components/ui/PerformanceCard';
import { PerformanceFilters } from '@/components/ui/PerformanceFilters';
import { PerformancePagination } from '@/components/ui/PerformancePagination';
import { useListPerformances, useDeletePerformance } from '@/hooks/usePerformances';
import type { PerformanceStatus } from '@/lib/performance-types';
import { useAuthStore } from '@/stores';

const DEFAULT_LIMIT = 12;

export const PerformanceListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const setPage = useCallback((newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(newPage));
      return prev;
    });
  }, [setSearchParams]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PerformanceStatus | undefined>();
  const user = useAuthStore((state) => state.user);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isPending, isError, isFetching } = useListPerformances({
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch || undefined,
    status,
  });

  const handleFilterChange = useCallback((newSearch: string, newStatus?: PerformanceStatus) => {
    setPage(1);
    setSearch(newSearch);
    setStatus(newStatus);
  }, [setPage]);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const deleteMutation = useDeletePerformance();

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId === null) return;
    deleteMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  }, [deleteConfirmId, deleteMutation]);

  const canDelete = useCallback(
    (_performanceId: number) => {
      if (!user || user.role !== 'admin') return false;
      return true;
    },
    [user],
  );

  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <div className="flex flex-col gap-6 w-full px-6 py-6">
        <h1 className="text-2xl font-bold text-[#222222]">
          공연 목록
        </h1>

        {user?.role === 'admin' && (
          <div className="flex justify-end">
            <Link to="/performances/create">
              <Button
                className="h-9 text-sm font-medium rounded-lg bg-gradient-to-br from-[#2977DC] to-[#6A9DE0]"
              >
                공연 생성
              </Button>
            </Link>
          </div>
        )}

        <PerformanceFilters
          search={search}
          status={status}
          onChange={handleFilterChange}
        />

        {isPending ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center text-[#EF4444]">
            데이터를 불러오지 못했습니다.
          </div>
        ) : items.length === 0 && !isFetching ? (
          <div className="flex flex-1 items-center justify-center text-[#A9A9A9]">
            공연이 없습니다.
          </div>
        ) : items.length === 0 && isFetching ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((performance) => (
              <PerformanceCard
                key={performance.id}
                performance={performance}
                canDelete={canDelete(performance.id)}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </div>
        )}

        {meta && meta.total > 0 && meta.totalPages > 1 && <PerformancePagination meta={meta} onPageChange={setPage} />}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공연 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-[#5A5A5A]">정말로 이 공연을 삭제하시겠습니까?</p>
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
    </>
  );
};
