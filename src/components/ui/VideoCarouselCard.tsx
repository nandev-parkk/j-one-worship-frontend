import { Check, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import type { YouTubeVideo } from '@/lib/youtube-types';
import { formatDuration } from '@/lib/youtube-utils';

interface VideoCarouselCardProps {
  video: YouTubeVideo;
  registered: boolean;
  onClick: () => void;
}

export const VideoCarouselCard: React.FC<VideoCarouselCardProps> = ({
  video,
  registered,
  onClick,
}) => {
  const thumbnailSrc = video.thumbnailUrl;

  return (
    <Card
      onClick={onClick}
      className={`flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-200 cursor-pointer
        ${registered
          ? 'ring-2 ring-[#22C55E] border-[#22C55E] shadow-md'
          : 'hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] hover:border-gray-400'
        }`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        <img
          src={thumbnailSrc}
          alt={video.title}
          className="h-full w-full object-cover"
        />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
          {formatDuration(video.duration)}
        </div>
        {/* Registered check icon */}
        {registered && (
          <div className="absolute top-2 right-2 rounded-full bg-[#22C55E] p-1 shadow-md">
            <Check size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 gap-2 px-6 pb-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-[#222222]">
          {video.title}
        </h3>

        {/* Channel */}
        <p className="text-xs text-[#5A5A5A]">
          {video.channelTitle}
        </p>

        {/* Metadata */}
        <div className="mt-auto flex flex-col gap-1.5 pt-1 text-xs text-[#5A5A5A]">
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-[#A9A9A9]" />
            <span>{video.creatorName ?? '-'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#A9A9A9]" />
            <span>{format(new Date(video.createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
