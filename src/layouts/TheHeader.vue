<template>
  <header class="the-header">
    <!-- 왼쪽: 현재 페이지 타이틀 -->
    <div class="header-left">
      <RouterLink to="/dashboard" class="header-logo">
        <span>
          <img
            src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axnklumwzgke/b/subpport-bucket/o/subport_logo_no_background.png"
            alt="subport"
            class="logo-img"
          />
        </span>
        <span class="logo-text">Subport</span>
      </RouterLink>
    </div>

    <!-- 오른쪽: 관리자 프로필 -->
    <div class="header-right">
      <div class="profile-wrap" ref="profileRef">
        <button class="profile-btn" @click="toggleDropdown">
          <span class="admin-name">관리자 프로필</span>
          <svg
            class="chevron"
            :class="{ rotated: dropdownOpen }"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <!-- 드롭다운 -->
        <div v-if="dropdownOpen" class="dropdown">
          <div class="dropdown-user">
            <div class="dropdown-avatar">{{ adminInitial }}</div>
            <div>
              <div class="dropdown-name">{{ adminName }}</div>
              <div class="dropdown-email">{{ adminEmail }}</div>
            </div>
          </div>
          <div class="dropdown-divider" />
          <button class="dropdown-item" @click="openPasswordModal">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            비밀번호 변경
          </button>
          <div class="dropdown-divider" />
          <button class="dropdown-item danger" @click="handleLogout">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- 비밀번호 변경 모달 -->
  <div
    v-if="passwordModalOpen"
    class="modal-backdrop"
    @click.self="closePasswordModal"
  >
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          비밀번호 변경
        </div>
        <button class="modal-close" @click="closePasswordModal">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-field">
          <label class="form-label">현재 비밀번호</label>
          <input
            v-model="passwordForm.current"
            type="password"
            class="form-input"
            :class="{ error: currentPasswordError }"
            placeholder="현재 비밀번호 입력"
            autocomplete="current-password"
          />
          <span v-if="currentPasswordError" class="field-error">{{
            currentPasswordError
          }}</span>
        </div>
        <div class="form-field">
          <label class="form-label">새 비밀번호</label>
          <input
            v-model="passwordForm.next"
            type="password"
            class="form-input"
            :class="{ error: newPasswordInvalid }"
            placeholder="새 비밀번호 입력"
            autocomplete="new-password"
          />
          <span v-if="newPasswordInvalid" class="field-error"
            >비밀번호는 12자 이상이어야 해요 (영문 + 숫자 + 특수문자)
          </span>
        </div>
        <div class="form-field">
          <label class="form-label">새 비밀번호 확인</label>
          <input
            v-model="passwordForm.confirm"
            type="password"
            class="form-input"
            :class="{ error: passwordMismatch }"
            placeholder="새 비밀번호 재입력"
            autocomplete="new-password"
          />
          <span v-if="passwordMismatch" class="field-error"
            >비밀번호가 일치하지 않아요</span
          >
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn-save"
          :disabled="!canSubmit"
          @click="handlePasswordChange"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          저장
        </button>
        <button class="btn-cancel" @click="closePasswordModal">취소</button>
      </div>
    </div>
  </div>

  <Snackbar ref="snackbarRef" />
</template>

<script setup lang="ts">
import { getProfile, updatePassword } from '@/api/account';
import { logout as logoutApi } from '@/api/auth';
import { isApiError } from '@/api/index';
import type { ProfileResponse } from '@/api/types';
import Snackbar from '@/components/Snackbar.vue';
import { useAuthStore } from '@/stores/auth';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';

const authStore = useAuthStore();

// ── 관리자 정보 ──────────────────────────────────────
const profile = ref<ProfileResponse | null>(null);
const adminName = computed(() => profile.value?.nickname ?? '관리자');
const adminEmail = computed(() => profile.value?.email ?? '');
const adminInitial = computed(() => adminName.value.charAt(0));

// 프로필 조회
async function fetchProfile() {
  try {
    const { data } = await getProfile();
    profile.value = data;
  } catch (e) {
    console.error('프로필 조회 실패:', e);
  }
}

onMounted(() => {
  fetchProfile();
});

// ── 드롭다운 ──────────────────────────────────────────
const dropdownOpen = ref(false);
const profileRef = ref<HTMLElement | null>(null);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function handleOutsideClick(e: MouseEvent) {
  if (profileRef.value && !profileRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false;
  }
}
onMounted(() => document.addEventListener('click', handleOutsideClick));
onBeforeUnmount(() =>
  document.removeEventListener('click', handleOutsideClick),
);

async function handleLogout() {
  dropdownOpen.value = false;
  try {
    await logoutApi();
  } catch (e) {
    console.error('로그아웃 API 실패:', e);
  }
  // 로컬 토큰 삭제 및 로그인 페이지 이동
  authStore.logout();
}

// ── 비밀번호 변경 모달 ────────────────────────────────
const passwordModalOpen = ref(false);
const passwordForm = reactive({ current: '', next: '', confirm: '' });
const currentPasswordError = ref('');
const snackbarRef = ref<InstanceType<typeof Snackbar> | null>(null);

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[\x21-\x7E]{12,}$/;

const newPasswordInvalid = computed(
  () => !!passwordForm.next && !PASSWORD_REGEX.test(passwordForm.next),
);
const passwordMismatch = computed(
  () => !!passwordForm.confirm && passwordForm.next !== passwordForm.confirm,
);
const canSubmit = computed(
  () =>
    passwordForm.current &&
    passwordForm.next &&
    passwordForm.confirm &&
    !newPasswordInvalid.value &&
    !passwordMismatch.value,
);

watch(
  () => passwordForm.current,
  () => {
    currentPasswordError.value = '';
  },
);

function openPasswordModal() {
  dropdownOpen.value = false;
  currentPasswordError.value = '';
  passwordModalOpen.value = true;
}
function closePasswordModal() {
  passwordModalOpen.value = false;
  passwordForm.current = '';
  passwordForm.next = '';
  passwordForm.confirm = '';
  currentPasswordError.value = '';
}
async function handlePasswordChange() {
  if (!canSubmit.value) return;
  try {
    await updatePassword({
      oldPassword: passwordForm.current,
      newPassword: passwordForm.next,
      confirmPassword: passwordForm.confirm,
    });
    snackbarRef.value?.show('비밀번호가 변경되었습니다.', 'success');
    closePasswordModal();
  } catch (e) {
    if (
      isApiError(e) &&
      e.response.data.code === 'ADMIN_CURRENT_PASSWORD_MISMATCH'
    ) {
      currentPasswordError.value = e.response.data.message;
      return;
    }
    snackbarRef.value?.show('비밀번호 변경에 실패했습니다.', 'error');
  }
}
</script>

<style scoped>
/* ── 헤더 ─────────────────────────────────────────── */
.the-header {
  height: 75px;
  background: #1e2330;
  border-bottom: 1px solid #2e3140;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 10px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background-color 0.15s;
  flex-shrink: 0;
  max-height: 100%;
}
.header-logo:hover {
  background: rgba(255, 255, 255, 0.05);
}
.logo-img {
  width: 55px;
  height: 55px;
  object-fit: contain;
}
.logo-text {
  font-size: 25px;
  font-weight: 800;
  color: #f0f2f5;
  letter-spacing: -0.3px;
}
.header-divider {
  width: 1px;
  height: 18px;
  background: #2e3140;
  margin: 0 8px;
}

.header-left {
  display: flex;
  align-items: center;
}
.page-label {
  font-size: 14px;
  font-weight: 600;
  color: #9aa0b0;
}

.header-right {
  display: flex;
  align-items: center;
}

/* ── 프로필 버튼 ──────────────────────────────────── */
.profile-wrap {
  position: relative;
}
.profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 10px;
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.profile-btn:hover {
  background: #2a2d38;
  border-color: #383c50;
}
.admin-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #6fcfc3;
  color: #0f1f1e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}
.admin-name {
  font-size: 13px;
  font-weight: 600;
  color: #f0f2f5;
}
.chevron {
  color: #5c6278;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.chevron.rotated {
  transform: rotate(180deg);
}

/* ── 드롭다운 ─────────────────────────────────────── */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: #22252e;
  border: 1px solid #383c50;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: dropIn 0.15s ease;
  z-index: 200;
}
@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.dropdown-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 10px;
}
.dropdown-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #6fcfc3;
  color: #0f1f1e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}
.dropdown-name {
  font-size: 13px;
  font-weight: 600;
  color: #f0f2f5;
}
.dropdown-email {
  font-size: 11px;
  color: #5c6278;
}
.dropdown-divider {
  height: 1px;
  background: #2e3140;
  margin: 4px 0;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #9aa0b0;
  font-family: inherit;
  transition: all 0.15s;
  text-align: left;
}
.dropdown-item:hover {
  background: #2a2d38;
  color: #f0f2f5;
}
.dropdown-item.danger {
  color: #ff6b6b;
}
.dropdown-item.danger:hover {
  background: rgba(250, 82, 82, 0.1);
  color: #ff6b6b;
}

/* ── 모달 ─────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.modal-box {
  background: #22252e;
  border-radius: 16px;
  border: 1px solid #383c50;
  width: 380px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.2s ease;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #2e3140;
}
.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #6fcfc3;
}
.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #5c6278;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: all 0.15s;
}
.modal-close:hover {
  background: #2a2d38;
  color: #f0f2f5;
}

.modal-body {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #9aa0b0;
}
.form-input {
  padding: 9px 12px;
  background: #2a2d38;
  border: 1px solid #383c50;
  border-radius: 8px;
  color: #f0f2f5;
  font-size: 13px;
  font-family: inherit;
  transition: border-color 0.15s;
}
.form-input:focus {
  outline: none;
  border-color: #6fcfc3;
}
.form-input::placeholder {
  color: #5c6278;
}
.form-input.error {
  border-color: #ff6b6b;
}
.field-error {
  font-size: 11px;
  color: #ff6b6b;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 22px 20px;
  border-top: 1px solid #2e3140;
}
.btn-save {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 8px;
  background: #6fcfc3;
  border: none;
  color: #0f1115;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s;
}
.btn-save:hover:not(:disabled) {
  background: #4ab5a8;
}
.btn-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-cancel {
  padding: 8px 18px;
  border-radius: 8px;
  background: #2a2d38;
  border: 1px solid #383c50;
  color: #9aa0b0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-cancel:hover {
  background: #30333f;
  color: #f0f2f5;
}
</style>
