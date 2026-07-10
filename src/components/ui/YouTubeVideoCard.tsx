import { Trash2, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import type { YouTubeVideo } from '@/lib/youtube-types';
import { formatDuration } from '@/lib/youtube-utils';

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
  canDelete: boolean;
  onDelete: (id: number) => void;
}

export const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({
  video,
  canDelete,
  onDelete,
}) => {
  const thumbnailSrc = video.thumbnailUrl;

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col"
    >
      <Card
        className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] hover:border-gray-400"
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
          {/* Delete button */}
          {canDelete && (
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(video.id);
                }}
                className="rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex flex-col flex-1 gap-2 px-6 pb-4">
          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight" style={{ color: '#222222' }}>
            {video.title}
          </h3>

          {/* Channel */}
          <p className="text-xs" style={{ color: '#5A5A5A' }}>
            {video.channelTitle}
          </p>

          {/* Metadata */}
          <div className="mt-auto flex flex-col gap-1.5 pt-1 text-xs" style={{ color: '#5A5A5A' }}>
            <div className="flex items-center gap-1.5">
              <User size={12} style={{ color: '#A9A9A9' }} />
              <span>{video.creatorName ?? '-'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: '#A9A9A9' }} />
              <span>{format(new Date(video.createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};
