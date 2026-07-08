export type UserRole = 'admin' | 'manager' | 'user';
export type UserPart = 'vocal' | 'drums' | 'guitar' | 'bass' | 'keyboard';

export interface UserInfo {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  part: UserPart | null;
}


export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message?: string;
    details?: { field: string; message: string }[];
  };
}
