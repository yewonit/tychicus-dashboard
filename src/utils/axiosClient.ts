import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// 환경별 설정
const env = {
  production: {
    AUTH_BASE_URL: 'https://attendance.icoramdeo.com/auth',
    API_BASE_URL: 'https://attendance.icoramdeo.com/api',
    ADMIN_CONTACT: 'admin@example.com',
  },
  development: {
    AUTH_BASE_URL: 'https://attendance-dev.icoramdeo.com/auth',
    API_BASE_URL: 'https://attendance-dev.icoramdeo.com/api',
    ADMIN_CONTACT: 'admin@example.com',
  },
  local: {
    AUTH_BASE_URL: 'http://localhost:3000/auth',
    API_BASE_URL: 'http://localhost:3000/api',
    ADMIN_CONTACT: 'admin@example.com',
  },
};

// 현재 환경 결정
const getCurrentEnv = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  } else if (process.env.REACT_APP_ENV === 'local') {
    return 'local';
  } else {
    return 'development'; // 기본값을 development로 변경
  }
};

const currentEnv = getCurrentEnv();
const config = env[currentEnv];

// API 기본 URL 설정
const API_BASE_URL = config.API_BASE_URL;
const AUTH_BASE_URL = config.AUTH_BASE_URL;

// Mock 모드 설정 (로컬 환경에서만 사용)
// const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' && currentEnv === 'local';

// API용 Axios 인스턴스 생성
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth용 Axios 인스턴스 생성
const authClient: AxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 공통 요청 인터셉터 함수
const addRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 토큰이 있으면 헤더에 추가
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

// 공통 응답 인터셉터 함수
const addResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    error => {
      // 401 에러 시 로그인 페이지로 리다이렉트
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// 인터셉터 적용
addRequestInterceptor(axiosClient);
addResponseInterceptor(axiosClient);
addRequestInterceptor(authClient);
addResponseInterceptor(authClient);

// 환경 정보와 함께 export
export { authClient, config, currentEnv };
export default axiosClient;
