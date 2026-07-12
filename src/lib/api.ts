import axios from 'axios';
import { useAuthStore } from '@/stores';

const api = axios.create({
  baseURL: '/api',
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Separate instance to avoid re-entering the interceptor on refresh requests
const refreshApi = axios.create({
  baseURL: '/api',
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false;
type Resolver = (token: string) => void;
let failedRequests: Resolver[] = [];

async function refreshService(): Promise<string | null> {
  const { refreshToken, token } = useAuthStore.getState();
  if (!refreshToken || !token) return null;

  try {
    const { data } = await refreshApi.post('/auth/refresh', {
      accessToken: token,
      refreshToken,
    });

    if (data.success) {
      const { accessToken, refreshToken: newRefresh, user } = data.data;
      useAuthStore.getState().setAuth(accessToken, newRefresh, user);
      return accessToken;
    }
  } catch {
    useAuthStore.getState().logout();
  }
  return null;
}

function processFailedRequests(token: string | null) {
  failedRequests.forEach((cb) => cb(token || ''));
  failedRequests = [];
}

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the ongoing refresh using Promise.withResolvers
        const { promise, resolve } = Promise.withResolvers<string>();
        failedRequests.push(resolve);
        const token = await promise;
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await refreshService();
      isRefreshing = false;

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processFailedRequests(newToken);
        return api(originalRequest);
      } else {
        processFailedRequests(null);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
