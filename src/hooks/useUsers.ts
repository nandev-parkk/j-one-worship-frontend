import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, UserInfo } from '@/lib/auth-types';
import type { UpdateProfileInput, ChangePasswordInput } from '@/lib/user-schema';

const userKeys = {
  all: ['users'] as const,
  me: ['users', 'me'] as const,
};

export function useGetMe() {
  return useQuery<UserInfo, unknown>({
    queryKey: userKeys.me,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UserInfo>>('/users/me');
      return data.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, unknown, { id: number; input: UpdateProfileInput }>({
    mutationFn: async ({ id, input }) => {
      const { data } = await api.patch<ApiResponse<null>>(`/users/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, unknown, { id: number; input: ChangePasswordInput }>({
    mutationFn: async ({ id, input }) => {
      const { data } = await api.patch<ApiResponse<null>>(`/users/${id}`, {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        newPasswordConfirm: input.newPasswordConfirm,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
