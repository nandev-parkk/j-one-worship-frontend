import { useState, useCallback, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PerformanceCard } from '@/components/PerformanceCard';
import { PerformanceFilters } from '@/components/PerformanceFilters';
import { PerformancePagination } from '@/components/PerformancePagination';
import { useListPerformances } from '@/hooks/usePerformances';
import type { PerformanceStatus } from '@/lib/performance-types';

const DEFAULT_LIMIT = 12;

export const PerformanceListPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PerformanceStatus | undefined>();

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
  }, []);

  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 w-full px-6 py-6">
        <h2 className="text-xl font-bold" style={{ color: '#222222' }}>
          공연 목록
        </h2>

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
