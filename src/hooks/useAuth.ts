import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthState, LoginRequest } from '../types';
import { login, logout, validateOrRefreshToken } from '../utils/authService';
import { clearAuthData, hasTokens } from '../utils/authUtils';

/**
 * 인증 상태 관리를 위한 커스텀 훅
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const initializationRef = useRef<boolean>(false);

  /**
   * 초기화 - 저장된 토큰 확인 및 검증 (useCallback 제거)
   */
  const initialize = async () => {
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      // 토큰이 존재하는지 확인
      if (!hasTokens()) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
        return;
      }

      // 토큰이 있으면 한 번만 검증 (앱 시작할 때만)
      try {
        const userData = await validateOrRefreshToken();

        setAuthState({
          isAuthenticated: true,
          user: userData,
          loading: false,
          error: null,
        });
      } catch (error) {
        // 토큰 검증 실패 시 모든 인증 데이터 삭제
        clearAuthData();
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: '인증이 만료되었습니다. 다시 로그인해주세요.',
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: '인증 상태를 확인할 수 없습니다.',
      });
    }
  };

  /**
   * 로그인 처리
   */
  const handleLogin = useCallback(async (credentials: LoginRequest): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const loginResponse = await login(credentials);

      setAuthState({
        isAuthenticated: true,
        user: loginResponse.userData,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      let errorMessage = '로그인에 실패했습니다.';
      if (error.response?.status === 401) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  /**
   * 로그아웃 처리
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      // 로그아웃 시 초기화 플래그 리셋 (다음에 다시 초기화 가능하도록)
      initializationRef.current = false;

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });

      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
  }, []);

  /**
   * 토큰 재검증 (수동 호출용)
   */
  const revalidateAuth = useCallback(async (): Promise<void> => {
    try {
      const userData = await validateOrRefreshToken();
      setAuthState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        error: null,
      }));
    } catch (error) {
      console.error('토큰 재검증 오류:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: '인증이 만료되었습니다.',
      });
    }
  }, []);

  /**
   * 에러 상태 초기화
   */
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * 강제 로그아웃 (토큰 만료 등의 경우)
   */
  const forceLogout = useCallback(() => {
    clearAuthData();

    // 강제 로그아웃 시 초기화 플래그 리셋
    initializationRef.current = false;

    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: '세션이 만료되었습니다. 다시 로그인해주세요.',
    });
    window.location.href = '/login';
  }, []);

  // 컴포넌트 마운트 시 한 번만 초기화
  useEffect(() => {
    initialize();
  }, []); // 의존성 배열을 비워서 마운트 시에만 실행

  return {
    // 상태
    ...authState,

    // 액션
    login: handleLogin,
    logout: handleLogout,
    revalidateAuth,
    clearError,
    forceLogout,
  };
};
