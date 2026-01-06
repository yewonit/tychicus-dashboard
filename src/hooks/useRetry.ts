import { useCallback, useRef } from 'react';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number) => void | undefined;
}

/**
 * 재시도 로직이 포함된 비동기 함수 실행 훅
 */
export const useRetry = () => {
  const retryCountRef = useRef<Record<string, number>>({});

  const executeWithRetry = useCallback(
    async <T>(key: string, fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> => {
      const { maxRetries = 3, retryDelay = 1000, onRetry } = options;

      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await fn();
          // 성공 시 재시도 카운트 초기화
          retryCountRef.current[key] = 0;
          return result;
        } catch (error: any) {
          lastError = error;

          // 네트워크 에러가 아니거나 마지막 시도인 경우
          const isNetworkError =
            error?.code === 'ERR_NETWORK' ||
            error?.message?.includes('Network Error') ||
            error?.response?.status >= 500;

          if (!isNetworkError || attempt === maxRetries) {
            retryCountRef.current[key] = 0;
            throw error;
          }

          // 재시도 콜백 호출
          if (onRetry) {
            onRetry(attempt + 1);
          }

          // 재시도 전 대기
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          retryCountRef.current[key] = attempt + 1;
        }
      }

      retryCountRef.current[key] = 0;
      throw lastError || new Error('재시도 실패');
    },
    []
  );

  return { executeWithRetry };
};
