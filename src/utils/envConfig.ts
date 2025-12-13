import { config, currentEnv } from './axiosClient';

// 환경 설정 유틸리티
export const getConfig = () => config;
export const getCurrentEnvironment = () => currentEnv;
export const isProduction = () => currentEnv === 'production';
export const isDevelopment = () => currentEnv === 'development';
export const isLocal = () => currentEnv === 'local';

// 현재 설정 출력 (디버깅용)
export const logCurrentConfig = () => {
  console.log('🔧 현재 환경 설정:', {
    환경: currentEnv,
    API_URL: config.API_BASE_URL,
    AUTH_URL: config.AUTH_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_ENV: process.env.REACT_APP_ENV,
  });
};

// 환경별 설정 확인
export const getApiUrl = () => config.API_BASE_URL;
export const getAuthUrl = () => config.AUTH_BASE_URL;
export const getAdminContact = () => config.ADMIN_CONTACT;
