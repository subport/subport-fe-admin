import { login, refresh } from '@/api/auth';
import { getProfile } from '@/api/account';
import type {
  ApiErrorResponse,
  LoginRequest,
  ProfileResponse,
} from '@/api/types';
import router from '@/router';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const ACCESS_TOKEN_KEY = 'accessToken';

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY),
  );
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const profile = ref<ProfileResponse | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value);

  // Actions
  const setAccessToken = (token: string | null) => {
    accessToken.value = token;
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const loginAction = async (credentials: LoginRequest) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await login(credentials);
      setAccessToken(response.data.accessToken);
      return true;
    } catch (err) {
      const apiError = err as { response?: { data: ApiErrorResponse } };
      // 로그인 실패 에러만 사용자에게 표시
      if (
        apiError.response?.data?.code === 'ADMIN_NOT_FOUND' ||
        apiError.response?.data?.code === 'ADMIN_PASSWORD_MISMATCH'
      ) {
        error.value = '이메일과 비밀번호를 확인해주세요.';
      } else {
        // 기타 에러
        error.value = '로그인 중 오류가 발생했습니다.';
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await refresh();
      setAccessToken(response.data.accessToken);
      return true;
    } catch {
      // Refresh Token도 만료됨 - 로그아웃 처리
      logout();
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    error.value = null;
    profile.value = null;
    router.push('/login');
  };

  const fetchProfile = async () => {
    if (profile.value) return; // 이미 있으면 조회 안 함
    try {
      const { data } = await getProfile();
      profile.value = data;
    } catch (e) {
      console.error('프로필 조회 실패:', e);
    }
  };

  return {
    accessToken,
    isLoading,
    error,
    profile,
    isAuthenticated,
    setAccessToken,
    clearError,
    loginAction,
    refreshToken,
    logout,
    fetchProfile,
  };
});
