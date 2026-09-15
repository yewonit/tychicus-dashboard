import axios from 'axios';

/**
 * API 에러에서 사용자에게 보여줄 메시지를 추출합니다.
 * 백엔드 에러 응답 형식: { success: false, error: { code, message } }
 * 서버 메시지가 없으면(네트워크 오류 등) fallback을 반환합니다.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: { message?: string }; message?: string } | undefined;
    return data?.error?.message || data?.message || fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
};
