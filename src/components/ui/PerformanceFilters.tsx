import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { PerformanceStatus } from '@/lib/performance-types';

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'upcoming', label: '예정' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
];

interface PerformanceFiltersProps {
  search: string;
  status?: PerformanceStatus;
  onChange: (search: string, status?: PerformanceStatus) => void;
}

export const PerformanceFilters: React.FC<PerformanceFiltersProps> = ({
  search,
  status,
  onChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row ml-auto max-w-md gap-3">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9A9A9]"
        />
        <Input
          placeholder="공연명 검색..."
          value={search}
          onChange={(e) => onChange(e.target.value, status)}
          className="pl-9 placeholder:text-gray-400"
        />
      </div>
      <Select
        value={status ?? ''}
        onValueChange={(value) => {
          onChange(search, value || undefined);
        }}
      >
        <SelectTrigger className="w-full sm:w-[160px] data-[placeholder]:text-gray-400">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
