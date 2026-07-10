import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { PerformanceFilterOption, UserFilterOption } from '@/lib/youtube-types';

interface YouTubeVideoFiltersProps {
  search: string;
  performanceId: number | null;
  userId: number | null;
  performances: PerformanceFilterOption[];
  users: UserFilterOption[];
  onChange: (search: string, performanceId: number | null, userId: number | null) => void;
}

export const YouTubeVideoFilters: React.FC<YouTubeVideoFiltersProps> = ({
  search,
  performanceId,
  userId,
  performances,
  users,
  onChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row ml-auto max-w-2xl gap-3">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: '#A9A9A9' }}
        />
        <Input
          placeholder="영상 제목 검색..."
          value={search}
          onChange={(e) => onChange(e.target.value, performanceId, userId)}
          className="pl-9 placeholder:text-gray-400"
        />
      </div>
      <Select
        value={performanceId == null ? '' : String(performanceId)}
        onValueChange={(value) => {
          onChange(search, value ? Number(value) : null, userId);
        }}
      >
        <SelectTrigger className="w-full sm:w-[160px] data-[placeholder]:text-gray-400">
          <SelectValue placeholder="공연" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">전체</SelectItem>
          {performances.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={userId == null ? '' : String(userId)}
        onValueChange={(value) => {
          onChange(search, performanceId, value ? Number(value) : null);
        }}
      >
        <SelectTrigger className="w-full sm:w-[160px] data-[placeholder]:text-gray-400">
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
  );
};
