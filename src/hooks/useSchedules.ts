import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse } from '@/lib/auth-types';
import type {
  CalendarSchedule,
  ScheduleItem,
  CreateScheduleInput,
  UpdateScheduleInput,
  ListSchedulesParams,
} from '@/lib/schedule-types';

// ─── Query Keys ────────────────────────────────────────────────

export const scheduleKeys = {
  all: ['schedules'] as const,
  list: () => [...scheduleKeys.all, 'list'] as const,
  listByMonth: (month: string) => [...scheduleKeys.list(), month] as const,
  detail: () => [...scheduleKeys.all, 'detail'] as const,
  detailById: (id: number) => [...scheduleKeys.detail(), id] as const,
};

// ─── GET /schedules ────────────────────────────────────────────

export function useListSchedules(params?: ListSchedulesParams) {
  return useQuery<CalendarSchedule[], unknown>({
    queryKey: scheduleKeys.listByMonth(params?.month ?? ''),
    queryFn: async () => {
      const query: Record<string, string> = {};
      if (params?.month) query.month = params.month;
      const { data } = await api.get<ApiResponse<CalendarSchedule[]>>('/schedules', {
        params: query,
      });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── GET /schedules/:id ────────────────────────────────────────
export function useGetSchedule(id: number, options?: { enabled?: boolean }) {
  return useQuery<ScheduleItem, unknown>({
    queryKey: scheduleKeys.detailById(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ScheduleItem>>(`/schedules/${id}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

// ─── POST /schedules ──────────────────────────────────────────

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation<ScheduleItem, unknown, CreateScheduleInput>({
    mutationFn: async (input) => {
      const { data } = await api.post<ApiResponse<ScheduleItem>>('/schedules', input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
}

// ─── PATCH /schedules/:id ──────────────────────────────────────

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation<ScheduleItem, unknown, { id: number; input: UpdateScheduleInput }>({
    mutationFn: async ({ id, input }) => {
      const { data } = await api.patch<ApiResponse<ScheduleItem>>(`/schedules/${id}`, input);
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detailById(id) });
    },
  });
}

// ─── DELETE /schedules/:id ─────────────────────────────────────

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: async (id) => {
      await api.delete(`/schedules/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
      queryClient.removeQueries({ queryKey: scheduleKeys.detailById(id) });
    },
  });
}
