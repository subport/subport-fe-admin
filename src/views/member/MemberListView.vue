<template>
  <div class="page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">회원 관리</h1>
        <span class="page-sub">서비스에 가입한 회원 정보를 관리해요</span>
      </div>
    </div>

    <!-- 필터 바 -->
    <div class="filter-bar">
      <!-- 회원 상태 -->
      <div class="filter-group">
        <label class="filter-label">회원 상태</label>
        <div class="status-tabs">
          <button
            v-for="tab in deletedTabs"
            :key="String(tab.value)"
            class="status-tab"
            :class="{ active: filters.deleted === tab.value }"
            @click="onFilterChange('deleted', tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 알림 설정 -->
      <div class="filter-group">
        <label class="filter-label">알림 설정</label>
        <div class="status-tabs">
          <button
            v-for="tab in reminderTabs"
            :key="String(tab.value)"
            class="status-tab"
            :class="{ active: filters.reminderEnabled === tab.value }"
            @click="onFilterChange('reminderEnabled', tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 정렬 -->
      <div class="filter-group">
        <label class="filter-label">정렬</label>
        <div class="status-tabs">
          <button
            v-for="tab in sortTabs"
            :key="tab.value"
            class="status-tab"
            :class="{ active: selectedSort === tab.value }"
            @click="onSortChange(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 이메일 검색 -->
      <div class="filter-group search-group">
        <label class="filter-label">이메일 검색</label>
        <div class="search-wrap">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="emailInput"
            type="text"
            class="search-input"
            placeholder="이메일로 검색"
            @keydown.enter="onEmailSearch"
          />
          <button v-if="emailInput" class="search-clear" @click="onEmailClear">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button class="search-btn" @click="onEmailSearch">검색</button>
        </div>
      </div>

      <!-- 초기화 -->
      <button class="reset-btn" @click="resetFilters">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-4.63" />
        </svg>
        초기화
      </button>
    </div>

    <!-- 결과 요약 -->
    <div class="result-summary">
      <span class="result-count"
        >총 <strong>{{ totalElements }}</strong
        >명</span
      >
    </div>

    <!-- 테이블 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-email">이메일</th>
            <th class="col-nickname">닉네임</th>
            <th class="col-subs">구독</th>
            <th class="col-custom">커스텀 구독</th>
            <th class="col-reminder">알림</th>
            <th class="col-login">마지막 활동</th>
            <th class="col-joined">가입일</th>
            <th class="col-status">상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!isLoading && members.length === 0">
            <td colspan="9" class="empty-cell">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>조회된 회원이 없어요</span>
            </td>
          </tr>

          <tr
            v-for="member in members"
            :key="member.id"
            class="data-row"
            :class="{ 'deleted-row': member.deleted }"
          >
            <td class="col-id">{{ member.id }}</td>
            <td class="col-email">
              <span class="email-text" :title="member.email">{{
                member.email
              }}</span>
            </td>
            <td class="col-nickname">
              <div class="nickname-wrap">
                <span class="nickname-text">{{ member.nickname }}</span>
              </div>
            </td>
            <td class="col-subs">
              <span class="count-chip"
                >{{ member.memberSubscriptionCount }}건</span
              >
            </td>
            <td class="col-custom">
              <span class="count-chip custom"
                >{{ member.customSubscriptionCount }}건</span
              >
            </td>
            <td class="col-reminder">
              <div v-if="member.reminderDaysBefore > 0" class="reminder-on">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                D-{{ member.reminderDaysBefore }}
              </div>
              <span v-else class="reminder-off">-</span>
            </td>
            <td class="col-login">
              <span class="date-text">{{
                member.lastActiveAt ? formatLoginTime(member.lastActiveAt) : '-'
              }}</span>
            </td>
            <td class="col-joined">
              <span class="date-text">{{ formatDate(member.createdAt) }}</span>
            </td>
            <td class="col-status">
              <span v-if="member.deleted" class="status-badge deleted"
                >탈퇴</span
              >
              <span v-else class="status-badge active">정상</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <template v-for="p in pageNumbers" :key="p">
        <button v-if="p === '...'" class="page-btn ellipsis">···</button>
        <button
          v-else
          class="page-btn"
          :class="{ active: currentPage === p }"
          @click="goToPage(p as number)"
        >
          {{ p }}
        </button>
      </template>
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMembers } from '@/api/members';
import type { Member } from '@/api/types';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ── 상태 ─────────────────────────────────────────
const isLoading = ref(false);
const members = ref<Member[]>([]);
const totalElements = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const pageSize = 15;

// ── 필터 ─────────────────────────────────────────
const emailInput = ref('');

const filters = reactive<{
  deleted: boolean | undefined;
  reminderEnabled: boolean | undefined;
  email: string;
}>({
  deleted: undefined,
  reminderEnabled: undefined,
  email: '',
});

// ── 정렬 ─────────────────────────────────────────
const SORT_MAP: Record<string, string> = {
  default: 'id,asc',
  recent: 'createdAt,desc',
  loggedIn: 'lastActiveAt,desc',
};

const selectedSort = ref('default');

const sortTabs = [
  { label: '기본', value: 'default' },
  { label: '최근 가입순', value: 'recent' },
  { label: '최근 로그인순', value: 'loggedIn' },
] as const;

function onSortChange(value: string) {
  selectedSort.value = value;
  currentPage.value = 1;
  updateQueryParams();
}

// ── 탭 정의 ──────────────────────────────────────
const deletedTabs = [
  { label: '전체', value: undefined as boolean | undefined },
  { label: '정상', value: false as boolean | undefined },
  { label: '탈퇴', value: true as boolean | undefined },
] as const;

const reminderTabs = [
  { label: '전체', value: undefined as boolean | undefined },
  { label: '알림 ON', value: true as boolean | undefined },
  { label: '알림 OFF', value: false as boolean | undefined },
] as const;

// ── API 호출 ─────────────────────────────────────
async function fetchMembers(isInitial = false) {
  if (isInitial) isLoading.value = true;
  try {
    const { data } = await getMembers({
      page: currentPage.value - 1,
      size: pageSize,
      sort: SORT_MAP[selectedSort.value],
      deleted: filters.deleted,
      reminderEnabled: filters.reminderEnabled,
      email: filters.email || undefined,
    });
    members.value = data.members;
    totalElements.value = data.totalElements;
    totalPages.value = data.totalPages;
  } catch (e) {
    console.error('회원 목록 조회 실패', e);
  } finally {
    if (isInitial) isLoading.value = false;
  }
}

// ── 필터/정렬 변경 ────────────────────────────────
function updateQueryParams() {
  const query: Record<string, string> = {};
  if (currentPage.value > 1) query.page = String(currentPage.value);
  if (filters.deleted !== undefined)
    query.status = filters.deleted ? 'deleted' : 'active';
  if (filters.reminderEnabled !== undefined)
    query.reminder = filters.reminderEnabled ? 'on' : 'off';
  if (filters.email) query.email = filters.email;
  if (selectedSort.value !== 'default') query.sort = selectedSort.value;

  router.replace({ query });
}

function onFilterChange<K extends keyof typeof filters>(
  key: K,
  value: (typeof filters)[K],
) {
  filters[key] = value;
  currentPage.value = 1;
  updateQueryParams();
}

function onEmailSearch() {
  filters.email = emailInput.value;
  currentPage.value = 1;
  updateQueryParams();
}

function onEmailClear() {
  emailInput.value = '';
  filters.email = '';
  currentPage.value = 1;
  updateQueryParams();
}

function resetFilters() {
  filters.deleted = undefined;
  filters.reminderEnabled = undefined;
  filters.email = '';
  emailInput.value = '';
  selectedSort.value = 'default';
  currentPage.value = 1;
  router.replace({ query: {} });
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  updateQueryParams();
}

// ── URL 쿼리 파라미터에서 상태 복원 ─────────────
function initFromQuery() {
  const query = route.query;
  currentPage.value = query.page ? Number(query.page) : 1;

  // status 쿼리 처리
  if (query.status === 'active') {
    filters.deleted = false;
  } else if (query.status === 'deleted') {
    filters.deleted = true;
  } else {
    filters.deleted = undefined;
  }

  // reminder 쿼리 처리
  if (query.reminder === 'on') {
    filters.reminderEnabled = true;
  } else if (query.reminder === 'off') {
    filters.reminderEnabled = false;
  } else {
    filters.reminderEnabled = undefined;
  }

  filters.email = (query.email as string) || '';
  emailInput.value = filters.email;
  selectedSort.value = (query.sort as string) || 'default';
}

// ── 초기화 ─────────────────────────────────────
onMounted(() => {
  initFromQuery();
  fetchMembers(true); // 초기 로딩
});

// ── 필터/정렬/페이지 변경 감지 → 재조회 ─────────
watch([() => ({ ...filters }), selectedSort, currentPage], () =>
  fetchMembers(),
);

// ── 라우트 쿼리 변경 감지 ───────────────────────
watch(
  () => route.query,
  () => {
    initFromQuery();
    fetchMembers();
  },
);

// ── 페이지 번호 계산 ──────────────────────────────
const pageNumbers = computed<(number | string)[]>(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (cur > 3) pages.push('...');
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++)
    pages.push(p);
  if (cur < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});

/**
 * 마지막 활동 시각
 * - 오늘: n초 전 / n분 전 / n시간 전
 * - 오늘 이전: YYYY.MM.DD
 */
function formatLoginTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    if (diffSec < 60) return `${diffSec}초 전`;
    if (diffMin < 60) return `${diffMin}분 전`;
    return `${diffHr}시간 전`;
  }

  return formatDate(isoString);
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
</script>

<style scoped>
.page {
  --bg-base: #1a1c22;
  --bg-surface: #22252e;
  --bg-raised: #2a2d38;
  --bg-hover: #30333f;
  --mint: #6fcfc3;
  --mint-dim: #4ab5a8;
  --mint-glow: rgba(111, 207, 195, 0.12);
  --text-primary: #f0f2f5;
  --text-secondary: #9aa0b0;
  --text-muted: #5c6278;
  --border: #2e3140;
  --border-mid: #383c50;

  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  background: var(--bg-base);
  min-height: 100vh;
  padding: 28px 32px 48px;
  color: var(--text-primary);
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 24px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
}
.page-sub {
  font-size: 13px;
  color: var(--text-muted);
}

/* ── 필터 바 ─────────────────────────────────────── */
.filter-bar {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 18px 20px;
  margin-bottom: 25px;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filter-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.3px;
}
.search-group {
  flex: 1;
  min-width: 200px;
}

.status-tabs {
  display: flex;
  gap: 4px;
}
.status-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 7px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
  height: 32px;
  box-sizing: border-box;
}
.status-tab:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.status-tab.active {
  background: var(--mint);
  color: #0f1115;
  border-color: var(--mint);
  font-weight: 700;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0 90px 0 32px;
  border-radius: 8px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  box-sizing: border-box;
  height: 32px;
}
.search-input::placeholder {
  color: var(--text-muted);
}
.search-input:focus {
  outline: none;
  border-color: var(--mint);
}
.search-clear {
  position: absolute;
  right: 70px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  padding: 2px;
}
.search-clear:hover {
  color: var(--text-primary);
}

.search-btn {
  position: absolute;
  right: 4px;
  padding: 5px 12px;
  border-radius: 6px;
  background: var(--mint);
  border: none;
  color: #0f1115;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-btn:hover {
  background: var(--mint-dim);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 7px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  align-self: flex-end;
  height: 32px;
  box-sizing: border-box;
}
.reset-btn:hover {
  background: rgba(250, 82, 82, 0.1);
  color: #ff6b6b;
  border-color: rgba(250, 82, 82, 0.3);
}

/* ── 결과 요약 ───────────────────────────────────── */
.result-summary {
  margin-bottom: 13px;
}
.result-count {
  font-size: 13px;
  color: var(--text-secondary);
}
.result-count strong {
  color: var(--text-primary);
  font-weight: 700;
}

/* ── 테이블 ──────────────────────────────────────── */
.table-wrap {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 20px;
  min-height: auto;
  display: flex;
  flex-direction: column;
}
.table-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}
.loading-spinner {
  animation: spin 0.8s linear infinite;
  color: var(--text-muted);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.data-table thead tr {
  background: var(--bg-raised);
  border-bottom: 1px solid var(--border-mid);
}
.data-table th {
  padding: 11px 14px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.4px;
  text-align: center;
}

.data-row {
  border-bottom: 1px solid var(--border);
  transition: background-color 0.15s;
}
.data-row:last-child {
  border-bottom: none;
}
.data-row:hover {
  background: var(--bg-hover);
}
.deleted-row {
  opacity: 0.5;
}
.data-table td {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text-primary);
  text-align: center;
  vertical-align: middle;
}
/* 컬럼 너비 */
.col-id {
  width: 50px;
  color: var(--text-muted) !important;
  font-size: 12px !important;
}
.col-nickname {
  width: 115px;
}
.col-subs {
  width: 70px;
}
.col-custom {
  width: 80px;
}
.col-reminder {
  width: 80px;
}
.col-login {
  width: 100px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}
.col-joined {
  width: 90px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}
.col-email {
  width: 195px;
}
.col-status {
  width: 70px;
}

.email-text {
  font-size: 13px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.nickname-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.nickname-text {
  font-size: 13px;
  font-weight: 500;
}

.count-chip {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-raised);
  padding: 2px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-mid);
}
.count-chip.custom {
  color: #f783ac;
  background: rgba(230, 73, 128, 0.1);
  border-color: rgba(230, 73, 128, 0.2);
}

/* 알림 - 줄바꿈 방지 */
.reminder-on {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--mint);
  background: var(--mint-glow);
  padding: 3px 8px;
  border-radius: 10px;
  border: 1px solid rgba(111, 207, 195, 0.2);
  white-space: nowrap;
}
.reminder-off {
  font-size: 13px;
  color: var(--text-muted);
}

.date-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 10px;
}
.status-badge.active {
  background: rgba(64, 192, 87, 0.12);
  color: #69db7c;
}
.status-badge.deleted {
  background: rgba(250, 82, 82, 0.12);
  color: #ff6b6b;
}

.empty-cell {
  text-align: center !important;
  padding: 52px 0 !important;
  color: var(--text-muted);
}
.empty-cell svg {
  opacity: 0.25;
  margin-bottom: 10px;
  display: block;
  margin-inline: auto;
}
.empty-cell span {
  font-size: 14px;
  display: block;
}

/* ── 페이지네이션 ─────────────────────────────────── */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid var(--border-mid);
  background: var(--bg-surface);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled):not(.ellipsis) {
  background: var(--bg-raised);
  color: var(--text-primary);
}
.page-btn.active {
  background: var(--mint);
  color: #0f1115;
  border-color: var(--mint);
  font-weight: 700;
}
.page-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.page-btn.ellipsis {
  border: none;
  background: none;
  cursor: default;
  color: var(--text-muted);
}

/* ── 반응형 ──────────────────────────────────────── */
@media (max-width: 1280px) {
  .col-login,
  .col-joined {
    display: none;
  }
}
@media (max-width: 1024px) {
  .col-custom {
    display: none;
  }
}
@media (max-width: 768px) {
  .page {
    padding: 16px;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .col-subs {
    display: none;
  }
}
</style>
