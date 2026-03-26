<template>
  <div class="page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">이메일 발송 관리</h1>
        <span class="page-sub">이메일 발송 현황을 관리해요</span>
      </div>
    </div>

    <!-- 필터 영역 -->
    <div class="filter-bar">
      <!-- 발송 날짜 -->
      <div class="filter-group">
        <label class="filter-label">발송 날짜</label>
        <div class="date-picker-wrap">
          <div class="custom-date-input" @click.stop="toggleCalendar">
            <input
              v-model="dateInputValue"
              type="text"
              class="date-input"
              placeholder="YYYY-MM-DD"
              readonly
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="calendar-icon"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <button
              v-if="dateInputValue"
              class="date-clear-btn"
              @click.stop="clearDate"
            >
              <svg
                width="12"
                height="12"
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

          <!-- 커스텀 달력 팝업 -->
          <div v-if="showCalendar" class="calendar-popup" @click.stop>
            <!-- 년월 선택 -->
            <div class="calendar-header">
              <select
                v-model="calendarYear"
                class="calendar-select year-select"
                @change="updateCalendarDays"
              >
                <option v-for="year in yearOptions" :key="year" :value="year">
                  {{ year }}년
                </option>
              </select>
              <select
                v-model="calendarMonth"
                class="calendar-select month-select"
                @change="updateCalendarDays"
              >
                <option v-for="month in 12" :key="month" :value="month">
                  {{ month }}월
                </option>
              </select>
            </div>

            <!-- 요일 헤더 -->
            <div class="calendar-weekdays">
              <span
                v-for="day in weekdays"
                :key="day"
                class="weekday"
                :class="{ sunday: day === '일', saturday: day === '토' }"
              >
                {{ day }}
              </span>
            </div>

            <!-- 날짜 그리드 -->
            <div class="calendar-days">
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                class="calendar-day"
                :class="{
                  'other-month': day.isOtherMonth,
                  'is-today': day.isToday,
                  'is-selected': day.isSelected,
                  'is-sunday': day.isSunday,
                  'is-saturday': day.isSaturday,
                }"
                @click="selectDate(day)"
              >
                <span class="day-number">{{ day.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 상태 필터 -->
      <div class="filter-group">
        <label class="filter-label">상태</label>
        <div class="status-tabs">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            class="status-tab"
            :class="{ active: filters.status === tab.value }"
            @click="onStatusChange(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- D-day 필터 -->
      <div class="filter-group">
        <label class="filter-label">알림 시점</label>
        <div class="status-tabs">
          <button
            v-for="d in ddayOptions"
            :key="d.value"
            class="status-tab"
            :class="{ active: filters.daysBeforePayment === d.value }"
            @click="onDdayChange(d.value)"
          >
            {{ d.label }}
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
        >건</span
      >
    </div>

    <!-- 테이블 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-expand"></th>
            <th class="col-email">수신 이메일</th>
            <th class="col-count">구독 건수</th>
            <th class="col-payment">결제일</th>
            <th class="col-dday">알림 시점</th>
            <th class="col-status">상태</th>
            <th class="col-time">발송 시각</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!isLoading && notifications.length === 0">
            <td colspan="7" class="empty-cell">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>조회된 발송 이력이 없어요</span>
            </td>
          </tr>

          <template v-for="(item, index) in notifications" :key="index">
            <tr
              class="data-row"
              :class="{
                expanded: expandedRows.has(index),
                'is-failed': item.status === 'FAILED',
              }"
              @click="toggleRow(index)"
            >
              <td class="col-expand">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="expand-icon"
                  :class="{ rotated: expandedRows.has(index) }"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </td>
              <td class="col-email">
                <span class="email-text">{{ item.email }}</span>
              </td>
              <td class="col-count">
                <span class="count-badge">{{ item.subscriptionCount }}건</span>
              </td>
              <td class="col-payment">{{ formatDate(item.paymentDate) }}</td>
              <td class="col-dday">
                <span class="dday-badge">
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
                  D-{{ item.daysBeforePayment }}</span
                >
              </td>
              <td class="col-status">
                <span class="status-badge" :class="item.status.toLowerCase()">
                  {{ statusLabelWithRetry(item) }}
                </span>
              </td>
              <td class="col-time">{{ formatDateTime(item.sentAt) }}</td>
            </tr>

            <!-- 펼침 영역: 구독 상세 -->
            <tr
              v-if="expandedRows.has(index)"
              class="detail-row"
              :class="{ 'is-failed': item.status === 'FAILED' }"
            >
              <td colspan="7" class="detail-cell">
                <div class="detail-content">
                  <div
                    v-for="(subscription, index) in item.subscriptions"
                    :key="index"
                    class="detail-item"
                  >
                    <div class="detail-left">
                      <img
                        :src="subscription.logoImageUrl"
                        alt="logo"
                        class="detail-logo"
                      />
                      <span class="detail-name">{{ subscription.name }}</span>
                    </div>
                    <span class="detail-amount"
                      >{{ subscription.amount
                      }}{{ subscription.amountUnit }}</span
                    >
                  </div>
                </div>
              </td>
            </tr>
          </template>
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
import {
  getEmailNotificationDetails,
  getEmailNotifications,
} from '@/api/emailNotification';
import type {
  EmailNotification,
  GetEmailNotificationDetailsParams,
  GetEmailNotificationsParams,
} from '@/api/types';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ── 상태 ─────────────────────────────────────────
const isLoading = ref(false);
const notifications = ref<EmailNotification[]>([]);
const totalElements = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const pageSize = 15;

// ── 필터 ─────────────────────────────────────────
const emailInput = ref('');
const dateInputValue = ref('');

const filters = reactive<GetEmailNotificationsParams>({
  page: 0,
  size: pageSize,
  status: undefined,
  daysBeforePayment: undefined,
  email: undefined,
  date: undefined,
});

// ── 커스텀 달력 상태 ──────────────────────────────
const showCalendar = ref(false);
const calendarYear = ref(new Date().getFullYear());
const calendarMonth = ref(new Date().getMonth() + 1);
const selectedDate = ref<Date | null>(null);

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
});

interface CalendarDay {
  date: number;
  isOtherMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  fullDate: Date;
}

const calendarDays = ref<CalendarDay[]>([]);

// ── 달력 로직 ────────────────────────────────────
function updateCalendarDays() {
  const days: CalendarDay[] = [];
  const year = calendarYear.value;
  const month = calendarMonth.value;

  // 해당 월의 첫 날과 마지막 날
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // 첫 날의 요일 (0: 일요일, 6: 토요일)
  const firstDayOfWeek = firstDay.getDay();

  // 이전 달의 날짜들
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i;
    const fullDate = new Date(year, month - 2, date);
    days.push({
      date,
      isOtherMonth: true,
      isToday: isToday(fullDate),
      isSelected: isSelectedDate(fullDate),
      isSunday: fullDate.getDay() === 0,
      isSaturday: fullDate.getDay() === 6,
      fullDate,
    });
  }

  // 현재 달의 날짜들
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = new Date(year, month - 1, i);
    days.push({
      date: i,
      isOtherMonth: false,
      isToday: isToday(fullDate),
      isSelected: isSelectedDate(fullDate),
      isSunday: fullDate.getDay() === 0,
      isSaturday: fullDate.getDay() === 6,
      fullDate,
    });
  }

  // 다음 달의 날짜들 (6행을 채우기 위해)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const fullDate = new Date(year, month, i);
    days.push({
      date: i,
      isOtherMonth: true,
      isToday: isToday(fullDate),
      isSelected: isSelectedDate(fullDate),
      isSunday: fullDate.getDay() === 0,
      isSaturday: fullDate.getDay() === 6,
      fullDate,
    });
  }

  calendarDays.value = days;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isSelectedDate(date: Date): boolean {
  if (!selectedDate.value) return false;
  return (
    date.getFullYear() === selectedDate.value.getFullYear() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getDate() === selectedDate.value.getDate()
  );
}

function toggleCalendar() {
  showCalendar.value = !showCalendar.value;
  if (showCalendar.value && selectedDate.value) {
    calendarYear.value = selectedDate.value.getFullYear();
    calendarMonth.value = selectedDate.value.getMonth() + 1;
    updateCalendarDays();
  }
}

function selectDate(day: CalendarDay) {
  selectedDate.value = day.fullDate;
  dateInputValue.value = formatDateForInput(day.fullDate);
  filters.date = dateInputValue.value;
  showCalendar.value = false;
  currentPage.value = 1;
  updateQueryParams();
}

function clearDate() {
  selectedDate.value = null;
  dateInputValue.value = '';
  filters.date = undefined;
  currentPage.value = 1;
  updateQueryParams();
  updateCalendarDays();
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 외부 클릭 시 달력 닫기
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.date-picker-wrap')) {
    showCalendar.value = false;
  }
}

onMounted(() => {
  updateCalendarDays();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// ── 상태 탭 ──────────────────────────────────────
const statusTabs = [
  { label: '전체', value: undefined as string | undefined },
  { label: '완료', value: 'SENT' },
  { label: '실패', value: 'FAILED' },
  { label: '예정', value: 'PENDING' },
] as const;

const ddayOptions = [
  { label: '전체', value: undefined as number | undefined },
  { label: '1일 전', value: 1 },
  { label: '3일 전', value: 3 },
] as const;

// ── 펼침/접힘 ────────────────────────────────────
const expandedRows = ref<Set<number>>(new Set());

async function toggleRow(index: number): Promise<void> {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index);
  } else {
    expandedRows.value.add(index);
    const item = notifications.value[index];
    if (item && !item.subscriptions) {
      const params: GetEmailNotificationDetailsParams = {
        email: item.email,
        paymentDate: item.paymentDate,
        daysBeforePayment: item.daysBeforePayment,
      };
      try {
        const { data } = await getEmailNotificationDetails(params);
        item.subscriptions = data;
      } catch (e) {
        console.error('구독 상세 조회 실패', e);
      }
    }
  }
  expandedRows.value = new Set(expandedRows.value);
}

// ── API 호출 ─────────────────────────────────────
async function fetchNotifications(isInitial = false) {
  if (isInitial) isLoading.value = true;
  try {
    const params: GetEmailNotificationsParams = {
      page: currentPage.value - 1,
      size: pageSize,
    };

    if (filters.status) params.status = filters.status;
    if (filters.daysBeforePayment !== undefined)
      params.daysBeforePayment = filters.daysBeforePayment;
    if (filters.email) params.email = filters.email;
    if (filters.date) params.date = filters.date;

    const { data } = await getEmailNotifications(params);
    notifications.value = data.notifications;
    totalElements.value = data.totalElements;
    totalPages.value = data.totalPages;
  } catch (e) {
    console.error('이메일 발송 목록 조회 실패', e);
  } finally {
    if (isInitial) isLoading.value = false;
  }
}

// ── 필터 변경 핸들러 ─────────────────────────────
function onStatusChange(value: string | undefined) {
  filters.status = value;
  currentPage.value = 1;
  updateQueryParams();
}

function onDdayChange(value: number | undefined) {
  filters.daysBeforePayment = value;
  currentPage.value = 1;
  updateQueryParams();
}

function onEmailSearch() {
  filters.email = emailInput.value || undefined;
  currentPage.value = 1;
  updateQueryParams();
}

function onEmailClear() {
  emailInput.value = '';
  filters.email = undefined;
  currentPage.value = 1;
  updateQueryParams();
}

function resetFilters() {
  filters.status = undefined;
  filters.daysBeforePayment = undefined;
  filters.email = undefined;
  filters.date = undefined;
  emailInput.value = '';
  dateInputValue.value = '';
  selectedDate.value = null;
  currentPage.value = 1;
  router.replace({ query: {} });
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  expandedRows.value.clear(); // 페이지 이동 시 펼침 상태 초기화
  updateQueryParams();
}

// ── URL 쿼리 파라미터 동기화 ────────────────────
function updateQueryParams() {
  const query: Record<string, string> = {};

  if (currentPage.value > 1) query.page = String(currentPage.value);
  if (filters.status) query.status = filters.status.toLowerCase();
  if (filters.daysBeforePayment !== undefined)
    query.daysBefore = String(filters.daysBeforePayment);
  if (filters.email) query.email = filters.email;
  if (filters.date) query.date = filters.date;

  router.replace({ query });
}

// ── URL 쿼리 파라미터 → 상태 복원 ───────────────
watch(
  () => route.query,
  query => {
    currentPage.value = query.page ? Number(query.page) : 1;
    filters.status = (query.status as string) || undefined;
    filters.daysBeforePayment = query.daysBefore
      ? Number(query.daysBefore)
      : undefined;
    filters.email = (query.email as string) || undefined;
    filters.date = (query.date as string) || undefined;
    emailInput.value = filters.email || '';
    dateInputValue.value = filters.date || '';

    if (filters.date) {
      const [year, month, day] = filters.date.split('-');
      selectedDate.value = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
      );
      calendarYear.value = Number(year);
      calendarMonth.value = Number(month);
      updateCalendarDays();
    } else {
      selectedDate.value = null;
    }

    fetchNotifications(true); // 초기 로딩
  },
  { immediate: true },
);

// ── 페이지 번호 계산 ─────────────────────────────
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

// ── 유틸 함수 ─────────────────────────────────────
function statusLabelWithRetry(item: EmailNotification): string {
  const map: Record<string, string> = {
    SENT: '완료',
    FAILED: '실패',
    PENDING: '예정',
  };
  const label = map[item.status] ?? item.status;

  if (item.status === 'FAILED') {
    return `${label} ${item.retryCount}/3`;
  }
  return label;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year}-${month}-${day}`;
}

function formatDateTime(dateTimeStr: string | null): string {
  if (!dateTimeStr) return '-';
  const date = new Date(dateTimeStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
</script>

<style scoped>
/* ── 기본 ────────────────────────────────────────── */
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

/* ── 헤더 ────────────────────────────────────────── */
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

/* ── 커스텀 달력 ─────────────────────────────────── */
.date-picker-wrap {
  position: relative;
  min-width: 140px;
}

.custom-date-input {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.date-input {
  width: 100%;
  height: 32px;
  padding: 0 32px 0 12px;
  border-radius: 8px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  cursor: pointer;
  box-sizing: border-box;
}

.date-input::placeholder {
  color: var(--text-muted);
}

.date-input:focus {
  outline: none;
  border-color: var(--mint);
}

.calendar-icon {
  position: absolute;
  right: 28px;
  color: var(--text-muted);
  pointer-events: none;
}

.date-clear-btn {
  position: absolute;
  right: 2px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  padding: 8px;
  z-index: 1;
}

.date-clear-btn:hover {
  color: var(--text-primary);
}

/* ── 달력 팝업 ───────────────────────────────────── */
.calendar-popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  background: #252830;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 16px;
  z-index: 100;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.calendar-header {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.calendar-select {
  background: var(--bg-hover);
  border: 1px solid var(--border-mid);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  cursor: pointer;
  outline: none;
}

.calendar-select:focus {
  border-color: var(--mint);
}

.year-select {
  flex: 1.2;
}

.month-select {
  flex: 1;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 8px 0;
}

.weekday.sunday {
  color: #ff6b6b;
}

.weekday.saturday {
  color: #69db7c;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: all 0.15s;
  position: relative;
}

.calendar-day:hover {
  background: var(--bg-hover);
}

.calendar-day.other-month {
  color: var(--text-muted);
}

.calendar-day.is-sunday:not(.other-month) {
  color: #ff6b6b;
}

.calendar-day.is-saturday:not(.other-month) {
  color: #69db7c;
}

.calendar-day.is-today {
  border: 1.5px solid var(--mint);
  color: var(--mint);
  font-weight: 600;
}

.calendar-day.is-selected {
  background: var(--mint);
  color: #0f1115;
  font-weight: 700;
}

.calendar-day.is-today.is-selected {
  background: var(--mint);
  color: #0f1115;
  border: 2px solid #ffffff;
  font-weight: 700;
}

.calendar-day.is-selected:hover {
  background: var(--mint-dim);
}

/* 상태 탭 */
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

/* 이메일 검색 */
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

/* 초기화 버튼 */
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
  overflow-x: auto;
  margin-bottom: 20px;
  min-height: auto;
  display: flex;
  flex-direction: column;
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
  cursor: pointer;
}
.data-row:hover {
  background: var(--bg-hover);
}
.data-row.expanded {
  background: var(--bg-hover);
}
.data-row.is-failed {
  background: rgba(250, 82, 82, 0.04);
}
.data-row.is-failed:hover {
  background: rgba(250, 82, 82, 0.08);
}
.data-table td {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text-primary);
  text-align: center;
  vertical-align: middle;
}

/* 컬럼 너비 */
.col-expand {
  width: 40px;
  color: var(--text-muted) !important;
}
.col-email {
  width: 200px;
  text-align: left !important;
}
.col-count {
  width: 80px;
}
.col-payment {
  width: 90px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}
.col-dday {
  width: 80px;
}
.col-status {
  width: 100px;
}
.col-time {
  width: 120px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}

/* 확장 아이콘 */
.expand-icon {
  transition: transform 0.2s;
  color: var(--text-muted);
}
.expand-icon.rotated {
  transform: rotate(180deg);
}

/* 이메일 텍스트 */
.email-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* 건수 배지 */
.count-badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--mint);
  background: var(--mint-glow);
  padding: 3px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-mid);
}

/* D-day 배지 */
.dday-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-raised);
  padding: 3px 8px;
  border-radius: 10px;
  border: 1px solid rgba(111, 207, 195, 0.2);
  white-space: nowrap;
}

/* 상태 배지 */
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 10px;
  display: inline-block;
  white-space: nowrap;
}
.status-badge.sent {
  background: rgba(64, 192, 87, 0.15);
  color: #69db7c;
}
.status-badge.failed {
  background: rgba(250, 82, 82, 0.15);
  color: #ff6b6b;
}
.status-badge.pending {
  background: rgba(253, 126, 20, 0.15);
  color: #ffa94d;
}

/* ── 펼침 상세 ───────────────────────────────────── */
.detail-row {
  background: var(--bg-base);
  border-bottom: 1px solid var(--border);
}
.detail-row.is-failed {
  background: rgba(250, 82, 82, 0.04);
}
.detail-cell {
  padding: 0 !important;
}
.detail-content {
  padding: 14px 14px 14px 64px;
  animation: slideDown 0.2s ease;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.detail-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  gap: 20px;
}
.detail-item:last-child {
  border-bottom: none;
}
.detail-left {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 140px;
  flex-shrink: 0;
}
.detail-logo {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: contain;
  flex-shrink: 0;
}
.detail-logo-fallback {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--bg-hover);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.detail-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.detail-amount {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
  white-space: nowrap;
  width: 70px;
  flex-shrink: 0;
}

/* ── 빈 상태 ─────────────────────────────────────── */
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
  opacity: 0.35;
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
  .col-payment,
  .col-dday {
    display: none;
  }
}
@media (max-width: 1024px) {
  .col-time {
    display: none;
  }
}
@media (max-width: 768px) {
  .page {
    padding: 16px;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .page-title {
    font-size: 20px;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    gap: 14px;
  }
  .filter-group {
    width: 100%;
  }
  .search-group {
    min-width: 100%;
  }
  .status-tabs {
    flex-wrap: wrap;
  }
  .status-tab {
    flex: 1;
    min-width: calc(33% - 3px);
    justify-content: center;
  }
  .col-count {
    display: none;
  }
  .col-status {
    display: none;
  }
  .data-table th,
  .data-table td {
    padding: 10px 8px;
    font-size: 12px;
  }
  .col-expand {
    width: 30px;
  }
  .col-email {
    width: auto;
    min-width: 140px;
  }
  .calendar-popup {
    width: 260px;
    padding: 12px;
  }
  .calendar-header {
    flex-direction: column;
    gap: 8px;
  }
  .calendar-select {
    width: 100%;
  }
}
@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }
  .status-tab {
    padding: 6px 8px;
    font-size: 11px;
  }
  .detail-content {
    padding: 12px 16px 12px 32px;
  }
  .detail-left {
    width: 100px;
  }
}
</style>
