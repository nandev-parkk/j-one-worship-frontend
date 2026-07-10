import { Check, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import type { YouTubeVideo } from '@/lib/youtube-types';
import { formatDuration } from '@/lib/youtube-utils';

interface PerformanceVideoListItemProps {
  video: YouTubeVideo;
  registered: boolean;
  onClick: () => void;
}

export const PerformanceVideoListItem: React.FC<PerformanceVideoListItemProps> = ({
  video,
  registered,
  onClick,
}) => {
  const thumbnailSrc = video.thumbnailUrl;

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 border-b border-gray-200 px-4 py-3 cursor-pointer transition-colors duration-150
        ${registered ? 'bg-green-50 border-l-2 border-[#22C55E] ml-[-2px]' : 'hover:bg-gray-50'}
        first:border-t-0`}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-[110px] h-[62px] overflow-hidden rounded bg-gray-100">
        <img
          src={thumbnailSrc}
          alt={video.title}
          className="h-full w-full object-cover"
        />
        {/* Duration badge */}
        <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] text-white">
          {formatDuration(video.duration)}
        </div>
        {/* Registered check icon */}
        {registered && (
          <div className="absolute top-1 right-1 rounded-full bg-[#22C55E] p-0.5 shadow-md">
            <Check size={10} className="text-white" />
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Title */}
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-tight text-[#222222]">
          {video.title}
        </h3>

        {/* Channel */}
        <p className="text-xs text-[#5A5A5A]">
          {video.channelTitle}
        </p>

        {/* Uploader + Created date */}
        <div className="flex items-center gap-3 text-xs text-[#5A5A5A]">
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-[#A9A9A9]" />
            <span>{video.creatorName ?? '-'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#A9A9A9]" />
            <span>{format(new Date(video.createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
