import { useState, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { MainLayout } from '@/components/ui/MainLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { PerformanceCard } from '@/components/ui/PerformanceCard';
import { PerformanceFilters } from '@/components/ui/PerformanceFilters';
import { PerformancePagination } from '@/components/ui/PerformancePagination';
import { useListPerformances } from '@/hooks/usePerformances';
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

  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 w-full px-6 py-6">
        <h2 className="text-xl font-bold" style={{ color: '#222222' }}>
          공연 목록
        </h2>

        {user?.role === 'admin' && (
          <div className="flex justify-end">
            <Link to="/performances/create">
              <Button
                className="h-9 text-sm font-medium rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #2977DC, #6A9DE0)',
                }}
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
          <div className="flex flex-1 items-center justify-center" style={{ color: '#EF4444' }}>
            데이터를 불러오지 못했습니다.
          </div>
        ) : items.length === 0 && !isFetching ? (
          <div className="flex flex-1 items-center justify-center" style={{ color: '#A9A9A9' }}>
            공연이 없습니다.
          </div>
        ) : items.length === 0 && isFetching ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((performance) => (
              <PerformanceCard key={performance.id} performance={performance} />
            ))}
          </div>
        )}

        {meta && meta.total > 0 && meta.totalPages > 1 && <PerformancePagination meta={meta} onPageChange={setPage} />}
      </div>
    </MainLayout>
  );
};
