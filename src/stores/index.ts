import { create } from 'zustand';
import type { UserInfo } from '@/lib/auth-types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  setAuth: (token: string, refreshToken: string, user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('auth_refresh_token'),
  user: (() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  })(),
  setAuth: (token: string, refreshToken: string, user: UserInfo) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_refresh_token', refreshToken);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ token, refreshToken, user });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_user');
    set({ token: null, refreshToken: null, user: null });
  },
}));
