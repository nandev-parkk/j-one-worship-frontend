import type { InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}
