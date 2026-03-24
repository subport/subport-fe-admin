<template>
  <div class="page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">테스트 피드백 관리</h1>
        <span class="page-sub">테스트용 사용자 피드백 현황을 관리해요</span>
      </div>
    </div>

    <!-- 필터 영역 -->
    <div class="filter-bar">
      <!-- 작성 날짜 -->
      <div class="filter-group">
        <label class="filter-label">작성 날짜</label>
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
            <th class="col-overall">사용하면서 느낀 점</th>
            <th class="col-feature">기능 추가 제안</th>
            <th class="col-date">작성 날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!isLoading && feedbacks.length === 0">
            <td colspan="4" class="empty-cell">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                />
              </svg>
              <span>조회된 피드백이 없어요</span>
            </td>
          </tr>

          <template v-for="(item, index) in feedbacks" :key="item.id">
            <tr
              class="data-row"
              :class="{ expanded: expandedRows.has(index) }"
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
              <td class="col-overall">
                <span class="content-preview">{{
                  truncateContent(item.overall, 40)
                }}</span>
              </td>
              <td class="col-feature">
                <span class="content-preview">{{
                  truncateContent(item.featureRequest, 40)
                }}</span>
              </td>
              <td class="col-date">{{ formatDateTime(item.createdAt) }}</td>
            </tr>

            <!-- 펼침 영역: 피드백 전체 내용 -->
            <tr v-if="expandedRows.has(index)" class="detail-row">
              <td colspan="4" class="detail-cell">
                <div class="detail-content">
                  <div class="detail-section">
                    <span class="detail-label"
                      >사용하면서 느낀 점을 자유롭게 들려주세요</span
                    >
                    <p
                      class="detail-text"
                      :class="{ 'is-empty': !item.overall?.trim() }"
                    >
                      {{ item.overall?.trim() || '내용 없음' }}
                    </p>
                  </div>
                  <div class="detail-section">
                    <span class="detail-label"
                      >어떤 기능이 추가되면 더 좋아질까요?</span
                    >
                    <p
                      class="detail-text"
                      :class="{ 'is-empty': !item.featureRequest?.trim() }"
                    >
                      {{ item.featureRequest?.trim() || '내용 없음' }}
                    </p>
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
import { getTestFeedbacks } from '@/api/testFeedback';
import type { GetTestFeedbacksParams, TestFeedback } from '@/api/types';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ── 상태 ─────────────────────────────────────────
const isLoading = ref(false);
const feedbacks = ref<TestFeedback[]>([]);
const totalElements = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const pageSize = 15;

// ── 필터 ─────────────────────────────────────────
const dateInputValue = ref('');

const filters = reactive<GetTestFeedbacksParams>({
  page: 0,
  size: pageSize,
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

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const firstDayOfWeek = firstDay.getDay();

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

// ── 펼침/접힘 ────────────────────────────────────
const expandedRows = ref<Set<number>>(new Set());

function toggleRow(index: number): void {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index);
  } else {
    expandedRows.value.add(index);
  }
  expandedRows.value = new Set(expandedRows.value);
}

// ── API 호출 ─────────────────────────────────────
async function fetchFeedbacks(isInitial = false) {
  if (isInitial) isLoading.value = true;
  try {
    const params: GetTestFeedbacksParams = {
      page: currentPage.value - 1,
      size: pageSize,
    };

    if (filters.date) params.date = filters.date;

    const { data } = await getTestFeedbacks(params);
    feedbacks.value = data.testFeedbacks;
    totalElements.value = data.totalElements;
    totalPages.value = data.totalPages;
  } catch (e) {
    console.error('피드백 목록 조회 실패', e);
  } finally {
    if (isInitial) isLoading.value = false;
  }
}

// ── 필터 변경 핸들러 ─────────────────────────────
function resetFilters() {
  filters.date = undefined;
  dateInputValue.value = '';
  selectedDate.value = null;
  currentPage.value = 1;
  router.replace({ query: {} });
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  expandedRows.value.clear();
  updateQueryParams();
}

// ── URL 쿼리 파라미터 동기화 ────────────────────
function updateQueryParams() {
  const query: Record<string, string> = {};

  if (currentPage.value > 1) query.page = String(currentPage.value);
  if (filters.date) query.date = filters.date;

  router.replace({ query });
}

// ── URL 쿼리 파라미터 → 상태 복원 ───────────────
watch(
  () => route.query,
  query => {
    currentPage.value = query.page ? Number(query.page) : 1;
    filters.date = (query.date as string) || undefined;
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

    fetchFeedbacks(true);
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
function truncateContent(
  content: string | null | undefined,
  maxLength: number = 40,
): string {
  if (!content || !content.trim()) return '-';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
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

/* ── 상태 탭 ─────────────────────────────────────── */
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

/* ── 초기화 버튼 ─────────────────────────────────── */
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
.data-table td {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text-primary);
  text-align: center;
  vertical-align: middle;
}

/* ── 컬럼 너비 ───────────────────────────────────── */
.col-expand {
  width: 40px;
  color: var(--text-muted) !important;
}
.col-overall {
  width: 200px;
  text-align: left !important;
}
.col-feature {
  width: 200px;
  text-align: left !important;
}
.col-date {
  width: 100px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
  white-space: nowrap;
}

/* ── 확장 아이콘 ─────────────────────────────────── */
.expand-icon {
  transition: transform 0.2s;
  color: var(--text-muted);
}
.expand-icon.rotated {
  transform: rotate(180deg);
}

/* ── 내용 미리보기 ───────────────────────────────── */
.content-preview {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

/* ── 펼침 상세 ───────────────────────────────────── */
.detail-row {
  background: var(--bg-base);
  border-bottom: 1px solid var(--border);
}
.detail-cell {
  padding: 0 !important;
}
.detail-content {
  padding: 16px 40px 16px 80px;
  animation: slideDown 0.2s ease;
}
.detail-section {
  margin-bottom: 20px;
}
.detail-section:last-child {
  margin-bottom: 0;
}
.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: block;
  text-align: left;
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
.detail-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}
.detail-text.is-empty {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
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
@media (max-width: 1024px) {
  .col-feature {
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
}
</style>
