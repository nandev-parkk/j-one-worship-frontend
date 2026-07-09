import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  ApiResponse,
  ApiErrorResponse,
} from '@/lib/auth-types';
import type {
  Performance,
  PerformanceDetail,
  CreatePerformanceInput,
  UpdatePerformanceInput,
  ListPerformancesParams,
  PaginationMeta,
  SetlistVideoItem,
  ListSetlistParams,
  SetlistOrderUpdate,
} from '@/lib/performance-types';

// ─── Query Keys ────────────────────────────────────────────────

const performanceKeys = {
  all: ['performances'] as const,
  lists: ['performances', 'list'] as const,
  list: (params: ListPerformancesParams) =>
    [...performanceKeys.lists, params] as const,
  details: ['performances', 'detail'] as const,
  detail: (id: number) =>
    [...performanceKeys.details, id] as const,
  setlists: ['performances', 'setlist'] as const,
  setlist: (performanceId: number, params: ListSetlistParams) =>
    [...performanceKeys.setlists, performanceId, params] as const,
};

// ─── GET /performances ─────────────────────────────────────────

const DEFAULT_LIMIT = 12;

interface ListPerformancesResponse {
  data: Performance[];
  meta: PaginationMeta;
}

export function useListPerformances(params: ListPerformancesParams = {}) {
  return useQuery<ListPerformancesResponse, ApiErrorResponse>({
    queryKey: performanceKeys.list(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Performance[]> & { meta: PaginationMeta }>(
        '/performances',
        { params },
      )
      return { data: data.data, meta: data.meta as PaginationMeta }
    },
    keepPreviousData: true,
    staleTime: 1000 * 60,
  })
}

// ─── GET /performances/:id ─────────────────────────────────────

export function useGetPerformance(id: number) {
  return useQuery<PerformanceDetail, ApiErrorResponse>({
    queryKey: performanceKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<PerformanceDetail>
      >(`/performances/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// ─── POST /performances ────────────────────────────────────────

export function useCreatePerformance() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Performance>,
    ApiErrorResponse,
    CreatePerformanceInput
  >({
    mutationFn: async (input) => {
      const { data } = await api.post<
        ApiResponse<Performance>
      >('/performances', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: performanceKeys.lists,
      });
    },
  });
}

// ─── PATCH /performances/:id ───────────────────────────────────

export function useUpdatePerformance() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Performance>,
    ApiErrorResponse,
    { id: number; input: UpdatePerformanceInput }
  >({
    mutationFn: async ({ id, input }) => {
      const { data } = await api.patch<
        ApiResponse<Performance>
      >(`/performances/${id}`, input);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: performanceKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: performanceKeys.lists,
      });
    },
  });
}

// ─── DELETE /performances/:id ──────────────────────────────────

export function useDeletePerformance() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiErrorResponse, number>({
    mutationFn: async (id) => {
      await api.delete(`/performances/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: performanceKeys.lists,
      });
    },
  });
}

// ─── POST /performances/:id/youtube-videos ─────────────────────

export function useAddPerformanceYouTubeVideo() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    ApiErrorResponse,
    { performanceId: number; videoId: number }
  >({
    mutationFn: async ({ performanceId, videoId }) => {
      const { data } = await api.post<ApiResponse<null>>(
        `/performances/${performanceId}/youtube-videos`,
        { videoId },
      );
      return data;
    },
    onSuccess: (_, { performanceId }) => {
      queryClient.invalidateQueries({
        queryKey: performanceKeys.detail(performanceId),
      });
    },
  });
}

// ─── DELETE /performances/:id/youtube-videos/:videoId ──────────

export function useRemovePerformanceYouTubeVideo() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiErrorResponse,
    { performanceId: number; videoId: number }
  >({
    mutationFn: async ({ performanceId, videoId }) => {
      await api.delete(
        `/performances/${performanceId}/youtube-videos/${videoId}`,
      );
    },
    onSuccess: (_, { performanceId }) => {
      queryClient.invalidateQueries({
        queryKey: performanceKeys.detail(performanceId),
      });
    },
  });
}

// ─── POST /performances/:id/setlist ────────────────────────────

export function useAddSetlist() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SetlistVideoItem>,
    ApiErrorResponse,
    { performanceId: number; videoId: number }
  >({
    mutationFn: async ({ performanceId, videoId }) => {
      const { data } = await api.post<
        ApiResponse<SetlistVideoItem>
      >(`/performances/${performanceId}/setlist`, { videoId });
      return data;
    },
    onSuccess: (_, { performanceId }) => {
      queryClient.invalidateQueries({
        queryKey: [...performanceKeys.setlists, performanceId],
      });
    },
  });
}

// ─── DELETE /performances/:id/setlist/:setlistId ───────────────

export function useRemoveSetlist() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiErrorResponse,
    { performanceId: number; setlistId: number }
  >({
    mutationFn: async ({ performanceId, setlistId }) => {
      await api.delete(
        `/performances/${performanceId}/setlist/${setlistId}`,
      );
    },
    onSuccess: (_, { performanceId }) => {
      queryClient.invalidateQueries({
        queryKey: [...performanceKeys.setlists, performanceId],
      });
    },
  });
}

// ─── PUT /performances/:id/setlist ─────────────────────────────

export function useUpdateSetlistOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    ApiErrorResponse,
    { performanceId: number; order: SetlistOrderUpdate[] }
  >({
    mutationFn: async ({ performanceId, order }) => {
      const { data } = await api.put<ApiResponse<null>>(
        `/performances/${performanceId}/setlist`,
        { order },
      );
      return data;
    },
    onSuccess: (_, { performanceId }) => {
      queryClient.invalidateQueries({
        queryKey: [...performanceKeys.setlists, performanceId],
      });
    },
  });
}

// ─── GET /performances/:id/setlist ─────────────────────────────

interface ListSetlistResponse {
  items: SetlistVideoItem[];
  total: number;
  meta: PaginationMeta;
}

export function useListSetlist(
  performanceId: number,
  params: ListSetlistParams = {},
) {
  return useQuery<ListSetlistResponse, ApiErrorResponse>({
    queryKey: performanceKeys.setlist(performanceId, params),
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<{ items: SetlistVideoItem[]; total: number }> & {
          meta: PaginationMeta;
        }
      >(`/performances/${performanceId}/setlist`, { params });
      return {
        items: data.data.items,
        total: data.data.total,
        meta: data.meta as PaginationMeta,
      };
    },
    enabled: !!performanceId,
  });
}
