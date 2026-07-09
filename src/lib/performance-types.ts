// Performance Status
export type PerformanceStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// Performance Entity
export interface Performance {
  id: number;
  name: string;
  description: string | null;
  datetime: string;
  location: string;
  status: PerformanceStatus;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// Performance Detail (with YouTube videos)
export interface PerformanceDetail {
  id: number;
  name: string;
  description: string | null;
  datetime: string;
  location: string;
  status: PerformanceStatus;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  videos: PerformanceVideoDetail[];
}

// YouTube Video Detail attached to a performance
export interface PerformanceVideoDetail {
  id: number;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration: string;
  voteCount: number;
}

// Setlist Video Item
export interface SetlistVideoItem {
  id: number;
  youtubeVideoId: number;
  title: string;
  artist: string;
  description: string | null;
  thumbnailUrl: string;
  youtubeUrl: string;
  orderIndex: number;
}

// API Input Types
export interface CreatePerformanceInput {
  name: string;
  description?: string;
  datetime: string | Date;
  location: string;
  status?: PerformanceStatus;
}

export interface UpdatePerformanceInput {
  name?: string;
  description?: string;
  datetime?: string | Date;
  location?: string;
  status?: PerformanceStatus;
}

// Query Parameters
export interface ListPerformancesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PerformanceStatus;
}

export interface ListSetlistParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Setlist Order Update
export interface SetlistOrderUpdate {
  setlistId: number;
  orderIndex: number;
}

// Pagination Meta
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
