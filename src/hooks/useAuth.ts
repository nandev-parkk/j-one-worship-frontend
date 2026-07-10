import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { LoginResponse, ApiResponse } from '@/lib/auth-types';
import type { LoginSchema } from '@/lib/auth-schema';

// Login mutation
export function useLogin() {
  return useMutation<ApiResponse<LoginResponse>, unknown, LoginSchema>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data;
      useAuthStore.getState().setAuth(accessToken, refreshToken, user);
    },
    onError: () => {
      useAuthStore.getState().logout();
    },
  });
}

// Logout mutation
export function useLogout() {
  return useMutation<void, unknown, void>({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      useAuthStore.getState().logout();
    },
  });
}
