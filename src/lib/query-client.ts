import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        // 429 Too Many Requests 는 재시도 안 함
        if ((error as any)?.response?.status === 429) return false;
        return failureCount < 1;
      },
    },
  },
});

export default queryClient;
