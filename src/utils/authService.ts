import {
  AccessibleOrganization,
  LoginRequest,
  LoginResponse,
  TokenData,
  TokenValidationResponse,
  UserData,
} from '../types';
import {
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  saveUserData,
} from './authUtils';
import { authClient } from './axiosClient';

/**
 * 로그인 API 호출
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await authClient.post<LoginResponse>(
      '/login',
      credentials
    );

    // 토큰과 사용자 데이터 저장
    saveTokens(response.data.tokens);
    saveUserData(response.data.userData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 토큰 유효성 검증 API 호출 (Bearer Token으로 /login 엔드포인트 호출)
 */
export const validateToken = async (): Promise<UserData> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('토큰이 없습니다');
    }

    // GET 방식으로 /login에 Bearer Token을 포함하여 호출
    const response = await authClient.get<TokenValidationResponse>('/login', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 사용자 데이터 업데이트 (토큰 검증 시에는 'user' 필드 사용)
    saveUserData(response.data.user);

    return response.data.user;
  } catch (error) {
    throw error;
  }
};

/**
 * 토큰 새로고침 API 호출
 */
export const refreshToken = async (): Promise<TokenData> => {
  try {
    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error('리프레시 토큰이 없습니다');
    }

    const response = await authClient.post<{ tokens: TokenData }>('/refresh', {
      refreshToken: currentRefreshToken,
    });

    // 새로운 토큰 저장
    saveTokens(response.data.tokens);

    return response.data.tokens;
  } catch (error) {
    // 리프레시 실패 시 모든 인증 데이터 삭제
    clearAuthData();
    throw error;
  }
};

/**
 * 로그아웃 처리
 */
export const logout = async (): Promise<void> => {
  try {
    // 서버에 로그아웃 요청 (선택사항)
    const accessToken = getAccessToken();
    if (accessToken) {
      await authClient.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
  } catch (error) {
    console.error('로그아웃 API 오류:', error);
    // 서버 로그아웃 실패해도 클라이언트에서는 데이터 삭제
  } finally {
    // 로컬 인증 데이터 삭제
    clearAuthData();
  }
};

/**
 * 자동 토큰 새로고침이 포함된 토큰 검증
 */
export const validateOrRefreshToken = async (): Promise<UserData> => {
  try {
    // 먼저 현재 토큰으로 검증 시도
    return await validateToken();
  } catch (error) {
    try {
      // 토큰 새로고침 시도
      await refreshToken();

      // 새로운 토큰으로 다시 검증
      return await validateToken();
    } catch (refreshError) {
      // 새로고침 실패 시 모든 인증 데이터 삭제
      clearAuthData();
      throw refreshError;
    }
  }
};

/**
 * 사용자가 접근 가능한 조직 구조 조회 (임시 정적 데이터 사용)
 */
export const getAccessibleOrganizations = async (): Promise<
  AccessibleOrganization[]
> => {
  try {
    // 임시 정적 데이터
    const mockData: AccessibleOrganization[] = [
      {
        depth: 0,
        id: 0,
        name: '코람데오 청년선교회',
      },
      {
        depth: 1,
        gooks: [
          {
            id: 3,
            name: '1국',
          },
          {
            id: 31,
            name: '2국',
          },
          {
            id: 65,
            name: '3국',
          },
          {
            id: 94,
            name: '4국',
          },
          {
            id: 127,
            name: '237국',
          },
        ],
      },
      {
        depth: 2,
        id: 3,
        name: '1국',
        groups: [
          {
            id: 4,
            name: '강병관그룹',
          },
          {
            id: 8,
            name: '김종성그룹',
          },
          {
            id: 12,
            name: '김상욱그룹',
          },
          {
            id: 16,
            name: '윤현군그룹',
          },
          {
            id: 20,
            name: '김은영그룹',
          },
          {
            id: 24,
            name: '신한빛그룹',
          },
          {
            id: 28,
            name: '김성원그룹',
          },
        ],
      },
    ];

    // 실제 API 호출 대신 임시 데이터 반환
    await new Promise(resolve => setTimeout(resolve, 500)); // 실제 API 호출처럼 지연 추가

    return mockData;
  } catch (error) {
    throw error;
  }
};
