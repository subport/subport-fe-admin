<template>
  <div class="dashboard">
    <!-- 헤더 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">대시보드</h1>
        <span class="dashboard-date">{{ todayFormatted }}</span>
      </div>
      <div class="header-right">
        <span class="last-updated">마지막 업데이트 {{ lastUpdated }}</span>
        <button
          class="refresh-btn"
          :class="{ spinning: isRefreshing }"
          :disabled="isRefreshing"
          @click="refreshData"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path
              d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
            />
          </svg>
          새로고침
        </button>
      </div>
    </div>

    <!-- 핵심 지표 카드 4개 -->
    <div class="stats-grid">
      <div
        v-for="(stat, index) in statCards"
        :key="index"
        class="stat-card"
        :style="{ animationDelay: `${index * 80}ms` }"
      >
        <div class="stat-icon" :class="stat.iconClass">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path v-for="(d, pi) in stat.iconPaths" :key="pi" :d="d" />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value">{{ stat.value.toLocaleString() }}</span>
          <div class="stat-trend-row">
            <template v-if="stat.showTrend">
              <span
                class="stat-badge"
                :class="
                  stat.trend > 0 ? 'up' : stat.trend < 0 ? 'down' : 'neutral'
                "
              >
                <template v-if="stat.trend > 0">▲</template>
                <template v-else-if="stat.trend < 0">▼</template>
                <template v-else></template>
                {{ Math.abs(stat.trend) }}{{ stat.trendUnit }}
              </span>
              <span class="stat-sub">{{ stat.sub }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 신규 가입자 추이 + 최근 가입 회원 -->
    <div class="charts-row">
      <!-- 바 차트 -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">신규 가입자 추이</h3>
            <p class="chart-sub">최근 2주 일별 신규 가입</p>
          </div>
        </div>
        <div class="chart-area">
          <div class="bar-chart-wrapper">
            <!-- 바 영역 -->
            <div class="bar-chart-body">
              <div
                v-for="(item, i) in signupBars"
                :key="i"
                class="bar-col"
                @mouseenter="hoveredBar = i"
                @mouseleave="hoveredBar = null"
              >
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :class="{ highlight: item.isToday }"
                    :style="{
                      height: `${(item.value / maxSignup) * 100}%`,
                      animationDelay: `${i * 40}ms`,
                    }"
                  >
                    <!-- 툴팁: 바 높이가 낮으면(20% 미만) 바 위에, 아니면 바 상단 내부에 -->
                    <div
                      class="bar-tooltip"
                      :class="{
                        visible: hoveredBar === i,
                        outside: item.value / maxSignup < 0.2,
                      }"
                    >
                      {{ item.value }}명
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 날짜 레이블 바닥 고정 -->
            <div class="bar-labels">
              <span
                v-for="(item, i) in signupBars"
                :key="i"
                class="bar-label"
                :class="{ today: item.isToday }"
                >{{ item.label }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 가입 회원 -->
      <div class="chart-card members-card">
        <div class="chart-header">
          <div class="card-title-wrap">
            <span class="title-icon user">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </span>
            <span class="card-title-text">최근 가입 회원</span>
          </div>
          <router-link to="/members" class="see-all">전체 보기 →</router-link>
        </div>
        <div class="member-list">
          <div v-for="(member, i) in recentMembers" :key="i" class="member-row">
            <div
              class="member-avatar"
              :style="{ background: getAvatarColor(member.nickname) }"
            >
              {{ member.nickname.charAt(0).toUpperCase() }}
            </div>
            <div class="member-info">
              <span class="member-name">{{ member.nickname }}</span>
              <span class="member-email">{{ member.email }}</span>
            </div>
            <div class="member-meta">
              <span class="member-subs"
                >구독 {{ member.memberSubscriptionCount }}개</span
              >
              <span class="member-joined">{{
                formatTime(member.createdAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단: 이메일 알림 발송 현황(좌) + 우측 스택 -->
    <div class="bottom-row">
      <!-- 이메일 알림 발송 현황 -->
      <div class="info-card noti-card">
        <div class="info-card-header">
          <div class="card-title-wrap">
            <span class="title-icon alarm">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <span class="card-title-text">오늘 이메일 발송 현황</span>
          </div>
          <router-link to="/email-notifications" class="see-all"
            >전체 보기 →</router-link
          >
        </div>
        <div class="noti-stat-row">
          <div class="noti-stat">
            <span class="noti-stat-num success">{{
              todayEmailNotifications.successCount
            }}</span>
            <span class="noti-stat-label">발송 완료</span>
          </div>
          <div class="noti-divider" />
          <div class="noti-stat">
            <span class="noti-stat-num pending">{{
              todayEmailNotifications.pendingCount
            }}</span>
            <span class="noti-stat-label">발송 예정</span>
          </div>
          <div class="noti-divider" />
          <div class="noti-stat">
            <span
              class="noti-stat-num"
              :class="
                todayEmailNotifications.failedCount > 0 ? 'error' : 'zero'
              "
              >{{ todayEmailNotifications.failedCount }}
            </span>
            <span class="noti-stat-label">실패</span>
          </div>
        </div>
        <div class="noti-list">
          <div
            v-for="(noti, i) in todayEmailNotifications.notifications"
            :key="i"
            class="noti-row"
          >
            <span class="noti-status-dot" :class="noti.status.toLowerCase()" />
            <div class="noti-info">
              <span class="noti-email">{{ noti.recipientEmail }}</span>
              <span class="noti-desc"
                >구독 서비스 {{ noti.subscriptionCount }}건 결제,
                {{ noti.daysBeforePayment }}일 전 알림
              </span>
            </div>
            <span class="noti-time">{{ formatNotiTime(noti.sentAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 우측 스택 -->
      <div class="right-stack">
        <!-- 구독 등록 현황 -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="card-title-wrap">
              <span class="title-icon svc">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </span>
              <span class="card-title-text">구독 등록 현황</span>
            </div>
          </div>

          <template
            v-if="!isLoading && topSubscriptions && topSubscriptions.length > 0"
          >
            <div class="top-subscriptions-list">
              <div
                v-for="(svc, i) in topSubscriptions"
                :key="i"
                class="top-subscription-row"
              >
                <span class="rank-num">{{ i + 1 }}</span>
                <div class="svc-logo-wrap">
                  <img
                    v-if="svc.subscriptionLogoImageUrl"
                    :src="svc.subscriptionLogoImageUrl"
                    :alt="svc.subscriptionName"
                    class="svc-logo"
                  />
                  <span v-else class="svc-logo-fallback">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </span>
                </div>
                <span class="svc-name">{{ svc.subscriptionName }}</span>
                <div class="svc-bar-wrap">
                  <div
                    class="svc-bar"
                    :style="{
                      width:
                        topSubscriptions && topSubscriptions.length > 0
                          ? `${(svc.memberSubscriptionCount / topSubscriptions[0].memberSubscriptionCount) * 100}%`
                          : '0%',
                    }"
                  />
                </div>
                <span class="svc-count"
                  >{{ svc.memberSubscriptionCount }}명</span
                >
              </div>
            </div>
          </template>
          <div v-if="!isLoading" class="empty-state">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>아직 등록된 구독이 없어요</span>
          </div>
        </div>

        <!-- 커스텀 구독 등록 현황 -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="card-title-wrap">
              <span class="title-icon custom">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </span>
              <span class="card-title-text">커스텀 구독 등록 현황</span>
            </div>
          </div>

          <!-- 데이터 있을 때 -->
          <template
            v-if="
              !isLoading &&
              topCustomSubscriptions &&
              topCustomSubscriptions.length > 0
            "
          >
            <div class="custom-list">
              <div
                v-for="(item, i) in topCustomSubscriptions"
                :key="i"
                class="custom-row"
              >
                <div class="custom-dot" />
                <span class="custom-name">{{
                  item.normalizedSubscriptionName
                }}</span>
                <span v-if="i < 2" class="new-badge">추가 검토</span>
                <span class="custom-count-badge"
                  >{{ item.memberSubscriptionCount }}명</span
                >
              </div>
            </div>
            <p class="custom-hint">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              많이 등록된 서비스는 기본 제공 추가를 고려해보세요.
            </p>
          </template>

          <!-- 데이터 없을 때 -->
          <div v-if="!isLoading" class="empty-state">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>아직 등록된 커스텀 구독이 없어요</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getRecentMembers,
  getSignUpTrend,
  getStats,
  getTodayEmailNotifications,
  getTopCustomSubscriptions,
  getTopSubscriptions,
} from '@/api/dashboard';
import type {
  DashboardStatsResponse,
  RecentMember,
  SignupTrendsResponse,
  TodayEmailNotificationsResponse,
  TopCustomSubscription,
  TopSubscription,
} from '@/api/types';
import type { SignupBar, StatCard } from '@/types/dashboard';
import { computed, onMounted, ref } from 'vue';

// ── 상태 ─────────────────────────────────────────
const isRefreshing = ref<boolean>(false);
const lastUpdated = ref<string>('');
const hoveredBar = ref<number | null>(null);

// ── statCards: API 응답 → UI 카드 배열로 매핑 ────
const statCards = ref<StatCard[]>([]);

function buildStatCards(data: DashboardStatsResponse): StatCard[] {
  const todayTrend = data.todayNewMemberCount - data.yesterdayNewMemberCount;
  return [
    {
      label: '전체 가입자',
      value: Number(data.totalMemberCount),
      trend: Number(data.weeklyNewMemberCount),
      trendUnit: '명',
      sub: '이번 주 신규',
      iconClass: 'icon-blue',
      showTrend: true,
      iconPaths: [
        'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
        'M9 7 a4 4 0 1 0 0.001 0',
        'M23 21v-2a4 4 0 0 0-3-3.87',
        'M16 3.13a4 4 0 0 1 0 7.75',
      ],
    },
    {
      label: '오늘 신규 가입',
      value: Number(data.todayNewMemberCount),
      trend: todayTrend,
      trendUnit: '명',
      sub: '어제 대비',
      iconClass: 'icon-green',
      showTrend: true,
      iconPaths: [
        'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
        'M8.5 7 a4 4 0 1 0 0.001 0',
        'M20 8v6',
        'M23 11h-6',
      ],
    },
    {
      label: '활성 구독 수',
      value: Number(data.totalMemberSubscriptionCount),
      trend: Number(data.weeklyNewMemberSubscriptionCount),
      trendUnit: '건',
      sub: '이번 주 신규 등록',
      iconClass: 'icon-purple',
      showTrend: true,
      iconPaths: ['M2 5h20v14H2z', 'M2 10h20'],
    },
    {
      label: '활성 유저 (최근 30일 이내 활동)',
      value: Number(data.currentActiveMemberCount),
      trend: 0,
      trendUnit: '',
      sub: '',
      iconClass: 'icon-orange',
      showTrend: false,
      iconPaths: ['M22 12h-4l-3 9L9 3l-3 9H2'],
    },
  ];
}

const signupBars = ref<SignupBar[]>([]);
const isLoading = ref(true);

function buildSignupBars(data: SignupTrendsResponse): SignupBar[] {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(new Date());
  return data.signupTrends.map(item => {
    const [, m, d] = item.date.split('-');
    return {
      label: `${Number(m)}/${Number(d)}`,
      value: item.newMemberCount,
      isToday: item.date === today,
    };
  });
}

const recentMembers = ref<RecentMember[]>([]);

const todayEmailNotifications = ref<TodayEmailNotificationsResponse>({
  notifications: [],
  successCount: 0,
  failedCount: 0,
  pendingCount: 0,
});

const topSubscriptions = ref<TopSubscription[]>([]);
const topCustomSubscriptions = ref<TopCustomSubscription[]>([]);

// ── computed ──────────────────────────────────────
const todayFormatted = computed<string>(() => {
  const now = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}요일`;
});

const maxSignup = computed<number>(() => {
  if (!signupBars.value.length) return 1;
  const max = Math.max(...signupBars.value.map(d => d.value));
  return max > 0 ? max : 1;
});

// ── 유틸 함수 ─────────────────────────────────────

/**
 * 닉네임 기반 아바타 배경색
 * 같은 닉네임은 항상 같은 색이 나옴
 */
function getAvatarColor(nickname: string): string {
  const colors = [
    '#4dabf7',
    '#69db7c',
    '#ffa94d',
    '#da77f2',
    '#ff8787',
    '#66d9e8',
    '#a9e34b',
    '#f783ac',
  ];
  return colors[nickname.charCodeAt(0) % colors.length];
}

/**
 * ISO 날짜 → 상대 시각 표현
 *
 * 1분 미만     → 방금 전
 * 1시간 미만   → N분 전
 * 오늘 이내    → N시간 전
 * 어제         → 어제 HH:mm
 * 이번 주 이내 → N일 전
 * 올해 이내    → MM.DD
 * 작년 이전    → YYYY.MM.DD
 */
function formatTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `어제 ${hh}:${mm}`;
  }

  if (diffDay < 7) return `${diffDay}일 전`;

  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  if (date.getFullYear() === now.getFullYear()) return `${m}.${d}`;
  return `${date.getFullYear()}.${m}.${d}`;
}

/**
 * 이메일 발송 시각 표현
 * LocalDateTime (2026-02-14T14:23:00) → HH:mm
 * sentAt가 null이면 (발송 예정) "예정" 반환
 */
function formatNotiTime(sentAt: string | null): string {
  if (!sentAt) return '예정';
  const date = new Date(sentAt);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function updateLastUpdated(): void {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  lastUpdated.value = `${y}.${m}.${d} ${hh}:${mm}`;
}

// ── 메서드 ────────────────────────────────────────
async function fetchStats(): Promise<void> {
  try {
    const { data } = await getStats();
    statCards.value = buildStatCards(data);
  } catch (e) {
    console.error('대시보드 통계 조회 실패', e);
  }
}

async function fetchSignupBars(): Promise<void> {
  try {
    const { data } = await getSignUpTrend();
    signupBars.value = buildSignupBars(data);
  } catch (e) {
    console.error('신규 가입자 추이 조회 실패', e);
  }
}

async function fetchRecentMembers(): Promise<void> {
  try {
    const { data } = await getRecentMembers();
    recentMembers.value = data.members;
  } catch (e) {
    console.error('최근 가입 회원 조회 실패', e);
  }
}

async function fetchTodayEmailNotifications(): Promise<void> {
  try {
    const { data } = await getTodayEmailNotifications();
    todayEmailNotifications.value = data;
  } catch (e) {
    console.error('오늘 이메일 발송 현황 조회 실패', e);
  }
}

async function fetchTopSubscriptions(): Promise<void> {
  try {
    const { data } = await getTopSubscriptions();
    topSubscriptions.value = data.topSubscriptions;
  } catch (e) {
    console.error('구독 등록 현황 조회 실패', e);
  }
}

async function fetchTopCustomSubscriptions(): Promise<void> {
  try {
    const { data } = await getTopCustomSubscriptions();
    topCustomSubscriptions.value = data.topCustomSubscriptions;
  } catch (e) {
    console.error('커스텀 구독 등록 현황 조회 실패', e);
  }
}

async function refreshData(): Promise<void> {
  isRefreshing.value = true;
  await Promise.all([
    fetchStats(),
    fetchSignupBars(),
    fetchRecentMembers(),
    fetchTodayEmailNotifications(),
    fetchTopSubscriptions(),
    fetchTopCustomSubscriptions(),
  ]);
  isRefreshing.value = false;
  updateLastUpdated();
}

onMounted(async () => {
  try {
    await Promise.all([
      fetchStats(),
      fetchSignupBars(),
      fetchRecentMembers(),
      fetchTodayEmailNotifications(),
      fetchTopSubscriptions(),
      fetchTopCustomSubscriptions(),
    ]);
    updateLastUpdated();
  } catch (e) {
    console.error('데이터 로드 실패:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ── 기본 ────────────────────────────────────────── */
.dashboard {
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

/* ── 로딩 상태 ────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.loading-spinner {
  animation: spin 0.8s linear infinite;
}

/* ── 헤더 ────────────────────────────────────────── */
.dashboard-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}
.dashboard-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
}
.dashboard-date {
  font-size: 13px;
  color: var(--text-muted);
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.last-updated {
  font-size: 12px;
  color: var(--text-muted);
}
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}
.refresh-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--mint);
}
.refresh-btn.spinning svg {
  animation: spin 0.8s linear infinite;
}
.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── 핵심 지표 카드 ──────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  animation: fadeUp 0.4s ease both;
  transition:
    box-shadow 0.2s,
    transform 0.2s,
    border-color 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
  border-color: var(--border-mid);
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-blue {
  background: rgba(51, 154, 240, 0.15);
  color: #74c0fc;
}
.icon-green {
  background: rgba(64, 192, 87, 0.15);
  color: #69db7c;
}
.icon-purple {
  background: rgba(121, 80, 242, 0.15);
  color: #b197fc;
}
.icon-orange {
  background: rgba(253, 126, 20, 0.15);
  color: #ffa94d;
}
.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}
.stat-value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.15;
}
.stat-trend-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}
.stat-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
  white-space: nowrap;
}
.stat-badge.up {
  background: rgba(64, 192, 87, 0.15);
  color: #69db7c;
}
.stat-badge.down {
  background: rgba(250, 82, 82, 0.15);
  color: #ff6b6b;
}
.stat-badge.neutral {
  background: var(--bg-raised);
  color: var(--text-muted);
}
.stat-sub {
  font-size: 11px;
  color: var(--text-muted);
}

/* ── 차트 행 ─────────────────────────────────────── */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  margin-bottom: 20px;
}
.chart-card {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 22px 24px;
}
.members-card {
  overflow: hidden;
}
.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}
.chart-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 3px;
  letter-spacing: -0.2px;
}
.chart-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

/* ── 바 차트 ─────────────────────────────────────── */
.chart-area {
  height: 210px;
  display: flex;
  flex-direction: column;
}
.bar-chart-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.bar-chart-body {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 6px;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  cursor: default;
}
.bar-track {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-end;
  max-height: 160px;
}
.bar-fill {
  width: 100%;
  border-radius: 5px 5px 0 0;
  background: rgba(111, 207, 195, 0.25);
  min-height: 4px;
  animation: growUp 0.6s ease both;
  transition: background-color 0.2s;
  position: relative;
}
.bar-fill.highlight {
  background: var(--mint);
}
.bar-col:hover .bar-fill {
  background: rgba(111, 207, 195, 0.5);
}
.bar-col:hover .bar-fill.highlight {
  background: var(--mint-dim);
}
@keyframes growUp {
  from {
    transform: scaleY(0);
    transform-origin: bottom;
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    transform-origin: bottom;
    opacity: 1;
  }
}

/* 툴팁 */
.bar-tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-mid);
  font-size: 11px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 10;
  top: 5px;
}
.bar-tooltip.outside {
  top: auto;
  bottom: calc(100% + 5px);
}
.bar-tooltip.visible {
  opacity: 1;
}
.bar-tooltip::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
}
.bar-tooltip.outside::after {
  top: 100%;
  border-top-color: var(--bg-hover);
}

/* 날짜 레이블 */
.bar-labels {
  display: flex;
  gap: 6px;
  padding-top: 5px;
}
.bar-label {
  flex: 1;
  text-align: center;
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
}
.bar-label.today {
  color: var(--mint);
  font-weight: 600;
}

/* ── 공통 카드 타이틀 ─────────────────────────────── */
.card-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-title-text {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
}
.title-icon {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.title-icon.alarm {
  background: rgba(253, 126, 20, 0.15);
  color: #ffa94d;
}
.title-icon.user {
  background: rgba(51, 154, 240, 0.15);
  color: #74c0fc;
}
.title-icon.svc {
  background: rgba(121, 80, 242, 0.15);
  color: #b197fc;
}
.title-icon.custom {
  background: rgba(230, 73, 128, 0.15);
  color: #f783ac;
}
.see-all {
  font-size: 12px;
  color: var(--mint);
  text-decoration: none;
}
.see-all:hover {
  color: var(--mint-dim);
  text-decoration: underline;
}

/* ── 최근 가입 회원 ───────────────────────────────── */
.member-list {
  display: flex;
  flex-direction: column;
}
.member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
}
.member-row:last-child {
  border-bottom: none;
}
.member-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.member-info {
  flex: 1;
  overflow: hidden;
}
.member-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
}
.member-email {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.member-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}
.member-subs {
  font-size: 11px;
  font-weight: 600;
  color: var(--mint);
}
.member-joined {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ── 하단 레이아웃 ───────────────────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  align-items: start;
}
.right-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-card {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 20px;
}
.info-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* ── 이메일 알림 발송 현황 ───────────────────────────────── */
.noti-stat-row {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  background: var(--bg-raised);
  border-radius: 10px;
  padding: 12px 0;
}
.noti-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.noti-divider {
  width: 1px;
  height: 30px;
  background: var(--border-mid);
}
.noti-stat-num {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}
.noti-stat-num.success {
  color: #69db7c;
}
.noti-stat-num.pending {
  color: #ffa94d;
}
.noti-stat-num.error {
  color: #ff6b6b;
}
.noti-stat-num.zero {
  color: var(--text-muted);
}
.noti-stat-label {
  font-size: 11px;
  color: var(--text-muted);
}
.noti-list {
  display: flex;
  flex-direction: column;
}
.noti-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}
.noti-row:last-child {
  border-bottom: none;
}
.noti-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.noti-status-dot.sent {
  background: #69db7c;
}
.noti-status-dot.failed {
  background: #ff6b6b;
}
.noti-status-dot.pending {
  background: #ffa94d;
}
.noti-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
}
.noti-email {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.noti-desc {
  font-size: 11px;
  color: var(--text-muted);
}
.noti-time {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ── 구독 등록 현황 ────────────────────────── */
.top-subscriptions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.top-subscription-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rank-num {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}
.svc-logo-wrap {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}
.svc-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}
.svc-logo-fallback {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-raised);
  color: var(--text-muted);
}
.svc-name {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
}
.svc-bar-wrap {
  width: 80px;
  height: 6px;
  background: var(--bg-raised);
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}
.svc-bar {
  height: 100%;
  border-radius: 3px;
  background: var(--mint);
  transition: width 1s ease;
}
.svc-count {
  font-size: 12px;
  color: var(--text-secondary);
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

/* ── 커스텀 구독 등록 현황 ─────────────────────────────── */
.custom-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.custom-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
}
.custom-row:last-child {
  border-bottom: none;
}
.custom-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border-mid);
  flex-shrink: 0;
}
.custom-name {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
}
.custom-count-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-raised);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--border-mid);
}
.new-badge {
  font-size: 10px;
  font-weight: 600;
  color: #f783ac;
  background: rgba(230, 73, 128, 0.12);
  padding: 2px 7px;
  border-radius: 10px;
}
.custom-hint {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 0;
  color: var(--text-muted);
  font-size: 13px;
}
.empty-state svg {
  opacity: 0.3;
}

/* ── 반응형 ──────────────────────────────────────── */
@media (max-width: 1280px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-row {
    grid-template-columns: 1fr;
  }
  .bottom-row {
    grid-template-columns: 1fr;
  }
  .right-stack {
    flex-direction: row;
  }
  .right-stack .info-card {
    flex: 1;
  }
}
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .right-stack {
    flex-direction: column;
  }
}
</style>
