<template>
  <div class="login-page">
    <!-- 배경 민트 글로우 -->
    <div class="bg-glow" aria-hidden="true"></div>

    <!-- 로그인 카드 -->
    <div class="login-card">
      <!-- 카드 상단 민트 라인 -->
      <div class="card-top-bar"></div>

      <!-- 로고 -->
      <div class="card-logo">
        <img
          src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axnklumwzgke/b/subpport-bucket/o/subport_logo_no_background.png"
          alt="subport"
          class="logo-img"
        />
        <span class="logo-text">Subport</span>
      </div>

      <h1 class="card-title">관리자 페이지</h1>
      <p class="card-sub">관리자 계정으로 로그인해주세요</p>

      <!-- 폼 -->
      <div class="login-form">
        <!-- 에러 메시지 (API 에러) -->
        <div v-if="authStore.error" class="error-banner">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="14" />
            <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
          </svg>
          {{ authStore.error }}
        </div>

        <!-- 이메일 -->
        <div class="form-field">
          <label class="form-label">이메일</label>
          <div class="input-wrap">
            <svg
              class="input-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="이메일 입력"
              autocomplete="email"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="form-field">
          <label class="form-label">비밀번호</label>
          <div class="input-wrap">
            <svg
              class="input-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="비밀번호 입력"
              autocomplete="current-password"
              @keyup.enter="handleLogin"
            />
            <button
              class="pw-toggle"
              type="button"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <svg
                v-if="showPassword"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                />
                <path
                  d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <svg
                v-else
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <button
          class="btn-login"
          :class="{ loading: authStore.isLoading }"
          :disabled="authStore.isLoading || !canSubmit"
          @click="handleLogin"
        >
          <span v-if="!authStore.isLoading">로그인</span>
          <span v-else class="spinner"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);

const canSubmit = computed(() => form.email.trim() && form.password.trim());

async function handleLogin() {
  if (!canSubmit.value || authStore.isLoading) return;
  authStore.clearError();

  const success = await authStore.loginAction({
    email: form.email,
    password: form.password,
  });

  if (success) {
    router.push('/dashboard');
  }
}

// 폼 입력 시 에러 메시지 초기화
watch(
  () => [form.email, form.password],
  () => {
    if (authStore.error) {
      authStore.clearError();
    }
  },
);
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #1a1c22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  position: relative;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(111, 207, 195, 0.07) 0%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.login-card {
  width: 400px;
  background: #22252e;
  border-radius: 18px;
  border: 1px solid #2e3140;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  position: relative;
  z-index: 1;
  animation: cardIn 0.3s ease;
}
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-top-bar {
  height: 4px;
  background: linear-gradient(90deg, #6fcfc3, #4ab5a8);
}

.card-logo {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 28px 32px 0;
}
.logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.logo-text {
  font-size: 18px;
  font-weight: 800;
  color: #f0f2f5;
  letter-spacing: -0.3px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #f0f2f5;
  letter-spacing: -0.3px;
  margin: 20px 32px 4px;
}
.card-sub {
  font-size: 13px;
  color: #5c6278;
  margin: 0 32px 24px;
}

.login-form {
  padding: 0 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(250, 82, 82, 0.1);
  border: 1px solid rgba(250, 82, 82, 0.25);
  border-radius: 8px;
  padding: 10px 8px;
  font-size: 13px;
  color: #ff6b6b;
  font-weight: 500;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #9aa0b0;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 12px;
  color: #5c6278;
  pointer-events: none;
}
.form-input {
  width: 100%;
  padding: 10px 40px 10px 38px;
  background: #2a2d38;
  border: 1px solid #383c50;
  border-radius: 9px;
  color: #f0f2f5;
  font-size: 14px;
  font-family: inherit;
  transition:
    border-color 0.15s,
    background-color 0.15s;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  border-color: #6fcfc3;
  background-color: #2e3240;
}
.form-input::placeholder {
  color: #5c6278;
}

.pw-toggle {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #5c6278;
  display: flex;
  padding: 4px;
  border-radius: 5px;
  transition: color 0.15s;
}
.pw-toggle:hover {
  color: #9aa0b0;
}

.btn-login {
  width: 100%;
  padding: 12px;
  margin-top: 4px;
  border-radius: 10px;
  background-color: #6fcfc3;
  border: none;
  color: #0f1115;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition:
    background-color 0.15s,
    transform 0.1s,
    opacity 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-login:hover:not(:disabled) {
  background-color: #4ab5a8;
  transform: translateY(-1px);
}
.btn-login:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.btn-login.loading {
  pointer-events: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2.5px solid rgba(15, 17, 21, 0.3);
  border-top-color: #0f1115;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── 반응형 ──────────────────────────────────────── */
@media (max-width: 480px) {
  .login-card {
    width: 90vw;
    max-width: 400px;
    border-radius: 14px;
  }
  .card-logo {
    padding: 20px 24px 0;
    justify-content: center;
  }
  .logo-img {
    width: 40px;
    height: 40px;
  }
  .logo-text {
    font-size: 16px;
  }
  .card-title {
    font-size: 18px;
    margin: 16px 24px 4px;
    text-align: center;
  }
  .card-sub {
    font-size: 12px;
    margin: 0 24px 20px;
    text-align: center;
  }
  .login-form {
    padding: 0 24px 24px;
  }
  .form-input {
    font-size: 14px;
    padding: 10px 38px;
  }
}
</style>
