import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse } from '@/lib/auth-types';
import type { PaginationMeta } from '@/lib/performance-types';
import type {
  YouTubeVideo,
  YouTubeVideoPreview as YouTubeVideoPreviewType,
  ListYouTubeVideosParams,
  RegisterYouTubeVideoInput,
  PerformanceFilterOption,
  UserFilterOption,
} from '@/lib/youtube-types';

// ─── Query Keys ────────────────────────────────────────────────

export const youtubeVideoKeys = {
  all: ['youtubeVideos'] as const,
  lists: ['youtubeVideos', 'list'] as const,
  list: (params: ListYouTubeVideosParams) =>
    [...youtubeVideoKeys.lists, params] as const,
  performances: ['youtubeVideos', 'performances'] as const,
  users: ['youtubeVideos', 'users'] as const,
};

// ─── GET /youtube-videos ───────────────────────────────────────

interface ListYouTubeVideosResponse {
  data: YouTubeVideo[];
  meta: PaginationMeta;
}

export function useListYouTubeVideos(params: ListYouTubeVideosParams = {}) {
  return useQuery<ListYouTubeVideosResponse, unknown>({
    queryKey: youtubeVideoKeys.list(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<YouTubeVideo[]> & { meta: PaginationMeta }>(
        '/youtube-videos',
        { params },
      );
      return { data: data.data, meta: data.meta as PaginationMeta };
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });
}

// ─── POST /youtube-videos ──────────────────────────────────────

export function useRegisterYouTubeVideo() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<YouTubeVideo>, unknown, RegisterYouTubeVideoInput>({
    mutationFn: async (input) => {
      const { data } = await api.post<ApiResponse<YouTubeVideo>>('/youtube-videos', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: youtubeVideoKeys.lists });
    },
  });
}

// ─── DELETE /youtube-videos/:id ────────────────────────────────

export function useDeleteYouTubeVideo() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/youtube-videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: youtubeVideoKeys.lists });
    },
  });
}

// ─── POST /youtube-videos/preview ──────────────────────────────

export function useYouTubeVideoPreviewMutation() {
  return useMutation<YouTubeVideoPreviewType, unknown, string>({
    mutationFn: async (url: string) => {
      const { data } = await api.post<ApiResponse<YouTubeVideoPreviewType>>(
        '/youtube-videos/preview',
        { url },
      );
      return data.data;
    },
  });
}

// ─── GET /performances (for filter) ────────────────────────────

export function useListPerformancesForFilter() {
  return useQuery<PerformanceFilterOption[], unknown>({
    queryKey: youtubeVideoKeys.performances,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PerformanceFilterOption[]>>(
        '/performances',
        { params: { limit: 100 } },
      );
      return data.data.map((p) => ({ id: p.id, name: p.name }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ─── GET /users (for filter) ───────────────────────────────────

export function useListUsersForFilter() {
  return useQuery<UserFilterOption[], unknown>({
    queryKey: youtubeVideoKeys.users,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UserFilterOption[]>>(
        '/users',
      );
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
// ─── GET /youtube-videos (전체 조회, 페이지네이션 없음) ─────────

export function useListAllYouTubeVideos() {
  return useListYouTubeVideos({ limit: 0 });
}
