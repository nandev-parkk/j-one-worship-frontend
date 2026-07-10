import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Play, Clock, User, AlertCircle } from 'lucide-react';
import { useYouTubeVideoPreviewMutation } from '@/hooks/useYouTubeVideos';
import { extractYouTubeVideoId, formatDuration } from '@/lib/youtube-utils';
import type { YouTubeVideoPreview as YouTubeVideoPreviewType } from '@/lib/youtube-types';

export interface YouTubeVideoPreviewProps {
  youtubeUrl: string;
  onClear: () => void;
  onSave: (videoId: string) => void;
  loading?: boolean;
  error?: string;
}

export const YouTubeVideoPreview: React.FC<YouTubeVideoPreviewProps> = ({
  youtubeUrl,
  onClear,
  onSave,
  loading,
  error,
}) => {
  const [inputUrl, setInputUrl] = useState(youtubeUrl);
  const [preview, setPreview] = useState<YouTubeVideoPreviewType | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const videoId = extractYouTubeVideoId(inputUrl);

  const { mutate, isPending: isPreviewLoading, isError: isPreviewError } = useYouTubeVideoPreviewMutation();


  const handleSearch = useCallback(() => {
    if (!videoId) {
      setValidationError('유효한 YouTube 링크를 입력해주세요.');
      return;
    }
    setValidationError(null);
    setPreview(null);
    mutate(inputUrl, {
      onSuccess: (data) => {
        setPreview(data);
      },
      onError: () => {
        setValidationError('영상 정보를 가져오지 못했습니다.');
      },
    });
  }, [videoId, inputUrl, mutate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const handleSave = useCallback(() => {
    if (videoId) {
      onSave(videoId);
    }
  }, [videoId, onSave]);

  const handleClear = useCallback(() => {
    setInputUrl('');
    setPreview(null);
    onClear();
  }, [onClear]);

  const displayThumbnail = preview?.thumbnailUrl || '';
  const displayTitle = preview?.title || '';
  const displayChannel = preview?.channelTitle || '';
  const displayDuration = preview?.duration ? formatDuration(preview.duration) : '';

  return (
    <div className="flex flex-col gap-4">
      {/* URL Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#222222]">
          YouTube 영상 링크를 입력해주세요
        </label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={inputUrl}
            onChange={(e) => { setInputUrl(e.target.value); if (validationError) setValidationError(null); }}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0"
          />
          <Button
            variant="outline"
            onClick={handleSearch}
            disabled={!inputUrl || isPreviewLoading}
          >
            <Search size={16} />
            미리보기
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {(error || validationError || isPreviewError) && (
        <div
          className="flex items-start gap-2 rounded-md px-3 py-2 text-sm bg-[#FEF2F2] text-[#EF4444]"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>
            {error || validationError || 'YouTube 영상 정보를 가져오지 못했습니다. 링크를 확인해주세요.'}
          </span>
        </div>
      )}

      {/* Preview Card */}
      {preview && (preview.thumbnailUrl || preview.title) && (
        <Card
          className="flex flex-col transition-all duration-200 border-[#E5E5E5]"
        >
          <CardContent className="flex flex-col sm:flex-row gap-4 pt-6">
            {/* Thumbnail */}
            <div className="shrink-0 w-full sm:w-48 aspect-video rounded-md overflow-hidden bg-gray-100 relative">
              {displayThumbnail ? (
                <img
                  src={displayThumbnail}
                  alt={displayTitle || 'YouTube Thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play size={24} className="text-[#A9A9A9]" />
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {displayTitle && (
                <h4 className="font-medium line-clamp-2 text-[#222222]">
                  {displayTitle}
                </h4>
              )}
              {displayChannel && (
                <div className="flex items-center gap-1.5 text-sm text-[#5A5A5A]">
                  <User size={14} className="text-[#A9A9A9]" />
                  <span className="truncate">{displayChannel}</span>
                </div>
              )}
              {displayDuration && (
                <div className="flex items-center gap-1.5 text-sm text-[#5A5A5A]">
                  <Clock size={14} className="text-[#A9A9A9]" />
                  <span>{displayDuration}</span>
                </div>
              )}
              {!displayTitle && !displayChannel && (
                <p className="text-sm text-[#8F8F8F]">
                  영상 정보를 미리보기할 수 없습니다. 링크가 올바른지 확인해주세요.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Indicator */}
      {isPreviewLoading && (
        <div className="flex items-center gap-2 text-sm text-[#5A5A5A]">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          <span>영상 정보를 가져오는 중...</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClear}>
          <X size={14} />
          취소
        </Button>
        <Button
          onClick={handleSave}
          disabled={!preview || loading}
          className="bg-[#2977DC] text-white hover:opacity-90"
        >
          저장
        </Button>
      </div>
    </div>
  );
};
