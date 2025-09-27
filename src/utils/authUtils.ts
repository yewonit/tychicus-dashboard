import { TokenData, UserData } from '../types';

// 토큰 저장 키
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

/**
 * 쿠키에 값을 저장하는 함수
 */
const setCookie = (
  name: string,
  value: string,
  expiresInSeconds: number
): void => {
  const date = new Date();
  date.setTime(date.getTime() + expiresInSeconds * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
};

/**
 * 쿠키에서 값을 가져오는 함수
 */
const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * 쿠키를 삭제하는 함수
 */
const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
};

/**
 * 토큰 데이터를 저장하는 함수
 */
export const saveTokens = (tokens: TokenData): void => {
  setCookie(ACCESS_TOKEN_KEY, tokens.accessToken, tokens.accessTokenExpiresAt);
  setCookie(
    REFRESH_TOKEN_KEY,
    tokens.refreshToken,
    tokens.refreshTokenExpiresAt
  );
};

/**
 * 사용자 데이터를 저장하는 함수
 */
export const saveUserData = (userData: UserData): void => {
  // 사용자 데이터는 localStorage에 저장 (민감하지 않은 정보)
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * 액세스 토큰을 가져오는 함수
 */
export const getAccessToken = (): string | null => {
  return getCookie(ACCESS_TOKEN_KEY);
};

/**
 * 리프레시 토큰을 가져오는 함수
 */
export const getRefreshToken = (): string | null => {
  return getCookie(REFRESH_TOKEN_KEY);
};

/**
 * 사용자 데이터를 가져오는 함수
 */
export const getUserData = (): UserData | null => {
  const userDataStr = localStorage.getItem(USER_DATA_KEY);
  if (!userDataStr) return null;

  try {
    return JSON.parse(userDataStr);
  } catch (error) {
    console.error('사용자 데이터 파싱 오류:', error);
    localStorage.removeItem(USER_DATA_KEY);
    return null;
  }
};

/**
 * 토큰이 존재하는지 확인하는 함수
 */
export const hasTokens = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken && refreshToken);
};

/**
 * 모든 인증 데이터를 삭제하는 함수
 */
export const clearAuthData = (): void => {
  // 쿠키 삭제
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);

  // 로컬스토리지 삭제
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Authorization 헤더를 생성하는 함수
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const accessToken = getAccessToken();
  if (!accessToken) return {};

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};
