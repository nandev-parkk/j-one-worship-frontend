import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import type { PaginationMeta } from '@/lib/performance-types';

interface PerformancePaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const PerformancePagination: React.FC<PerformancePaginationProps> = ({
  meta,
  onPageChange,
}) => {
  const { page, totalPages } = meta;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
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
};
