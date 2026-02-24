import axios from 'axios';
import type { ApiErrorResponse, TokenResponse } from './types';

const ACCESS_TOKEN_KEY = 'accessToken';

const api = axios.create({
  baseURL: 'https://api.subport.site/admin',
});

// 토큰 재발급 중인지 여부
let isRefreshing = false;
// 재발급 대기 중인 요청들의 콜백
let refreshSubscribers: ((token: string) => void)[] = [];

// 대기 중인 요청들을 처리
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 재발급 대기
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Request Interceptor: Access Token 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response Interceptor: 토큰 만료 시 자동 재발급
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Access Token 만료 확인
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'ACCESS_TOKEN_EXPIRED' &&
      !(originalRequest as { _retry?: boolean })._retry
    ) {
      if (isRefreshing) {
        // 이미 재발급 중이면 대기
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      (originalRequest as { _retry?: boolean })._retry = true;
      isRefreshing = true;

      try {
        // Refresh API 호출 (withCredentials로 쿠키 전송)
        const refreshResponse = await axios.post<TokenResponse>(
          'https://api.subport.site/admin/auth/refresh',
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

        // 대기 중인 요청들 처리
        onRefreshed(newAccessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료됨
        localStorage.removeItem(ACCESS_TOKEN_KEY);

        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// 타입 가드 헬퍼
export const isApiError = (
  error: unknown,
): error is { response: { data: ApiErrorResponse } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as Record<string, unknown>).response === 'object'
  );
};
