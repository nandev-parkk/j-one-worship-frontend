// YouTube 영상 엔티티
interface PerformanceInfo {
  performanceId: number;
  performanceName: string;
}

export interface YouTubeVideo {
  id: number;
  videoId: string; // YouTube video ID (e.g. "dQw4w9WgXcQ")
  title: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
  createdBy: number;
  creatorName: string;
  createdAt: string;
  performanceInfo: PerformanceInfo[];
}

// YouTube 링크 미리보기 응답
export interface YouTubeVideoPreview {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration: string;
}

// 목록 조회 파라미터
export interface ListYouTubeVideosParams {
  page?: number;
  limit?: number;
  search?: string;
  performanceId?: number | null;
  userId?: number | null;
}

// 삭제 파라미터
export interface DeleteYouTubeVideoParams {
  videoId: number;
}

// 영상 등록 요청
export interface RegisterYouTubeVideoInput {
  videoId: string;
}

// 필터 옵션
export interface PerformanceFilterOption {
  id: number;
  name: string;
}

export interface UserFilterOption {
  id: number;
  name: string;
}
