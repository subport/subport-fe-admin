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
import { defineStore } from 'pinia';
import { ref } from 'vue';

const CACHE_KEYS = {
  stats: 'dashboard_stats',
  signupBars: 'dashboard_signup_bars',
  recentMembers: 'dashboard_recent_members',
  todayEmailNotifications: 'dashboard_today_email_notifications',
  topSubscriptions: 'dashboard_top_subscriptions',
  topCustomSubscriptions: 'dashboard_top_custom_subscriptions',
  lastUpdated: 'dashboard_last_updated',
};

export const useDashboardStore = defineStore('dashboard', () => {
  const statCards = ref<StatCard[]>([]);
  const signupBars = ref<SignupBar[]>([]);
  const recentMembers = ref<RecentMember[]>([]);
  const todayEmailNotifications = ref<TodayEmailNotificationsResponse>({
    notifications: [],
    successCount: 0,
    failedCount: 0,
    pendingCount: 0,
  });
  const topSubscriptions = ref<TopSubscription[]>([]);
  const topCustomSubscriptions = ref<TopCustomSubscription[]>([]);
  const lastUpdated = ref<string>('');
  const isLoading = ref(false);

  function buildStatCards(data: DashboardStatsResponse): StatCard[] {
    const todayTrend = data.todayNewMemberCount - data.yesterdayNewMemberCount;
    return [
      {
        label: '전체 회원',
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
        label: '오늘 신규 회원',
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
        label: '오늘 방문자',
        value: Number(data.todayGuestCount),
        trend: Number(data.todayGuestCount) - Number(data.yesterdayGuestCount),
        trendUnit: '명',
        sub: '어제 대비',
        iconClass: 'icon-gray',
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
        sub: '이번 주 신규',
        iconClass: 'icon-purple',
        showTrend: true,
        iconPaths: ['M2 5h20v14H2z', 'M2 10h20'],
      },
      {
        label: '활성 회원',
        value: Number(data.currentActiveMemberCount),
        trend: 0,
        trendUnit: '',
        sub: '최근 30일 이내 활동',
        iconClass: 'icon-orange',
        showTrend: false,
        iconPaths: ['M22 12h-4l-3 9L9 3l-3 9H2'],
      },
    ];
  }

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

  function saveToLocalStorage(): void {
    try {
      localStorage.setItem(CACHE_KEYS.stats, JSON.stringify(statCards.value));
      localStorage.setItem(
        CACHE_KEYS.signupBars,
        JSON.stringify(signupBars.value),
      );
      localStorage.setItem(
        CACHE_KEYS.recentMembers,
        JSON.stringify(recentMembers.value),
      );
      localStorage.setItem(
        CACHE_KEYS.todayEmailNotifications,
        JSON.stringify(todayEmailNotifications.value),
      );
      localStorage.setItem(
        CACHE_KEYS.topSubscriptions,
        JSON.stringify(topSubscriptions.value),
      );
      localStorage.setItem(
        CACHE_KEYS.topCustomSubscriptions,
        JSON.stringify(topCustomSubscriptions.value),
      );
      localStorage.setItem(CACHE_KEYS.lastUpdated, lastUpdated.value);
    } catch (e) {
      console.error('localStorage 저장 실패:', e);
    }
  }

  function loadFromLocalStorage(): boolean {
    try {
      const stats = localStorage.getItem(CACHE_KEYS.stats);
      const signupBarsData = localStorage.getItem(CACHE_KEYS.signupBars);
      const recentMembersData = localStorage.getItem(CACHE_KEYS.recentMembers);
      const todayEmailNotificationsData = localStorage.getItem(
        CACHE_KEYS.todayEmailNotifications,
      );
      const topSubscriptionsData = localStorage.getItem(
        CACHE_KEYS.topSubscriptions,
      );
      const topCustomSubscriptionsData = localStorage.getItem(
        CACHE_KEYS.topCustomSubscriptions,
      );
      const lastUpdatedData = localStorage.getItem(CACHE_KEYS.lastUpdated);

      if (
        !stats ||
        !signupBarsData ||
        !recentMembersData ||
        !todayEmailNotificationsData ||
        !topSubscriptionsData ||
        !topCustomSubscriptionsData ||
        !lastUpdatedData
      ) {
        return false;
      }

      statCards.value = JSON.parse(stats);
      signupBars.value = JSON.parse(signupBarsData);
      recentMembers.value = JSON.parse(recentMembersData);
      todayEmailNotifications.value = JSON.parse(todayEmailNotificationsData);
      topSubscriptions.value = JSON.parse(topSubscriptionsData);
      topCustomSubscriptions.value = JSON.parse(topCustomSubscriptionsData);
      lastUpdated.value = lastUpdatedData;

      return true;
    } catch (e) {
      console.error('localStorage 로드 실패:', e);
      return false;
    }
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

  async function refreshData(): Promise<boolean> {
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
      saveToLocalStorage();
      return true;
    } catch (e) {
      console.error('데이터 새로고침 실패:', e);
      return false;
    }
  }

  async function initFromCache(): Promise<boolean> {
    const hasCache = loadFromLocalStorage();
    if (!hasCache) {
      isLoading.value = true;
      await refreshData();
      isLoading.value = false;
    }
    return hasCache;
  }

  return {
    statCards,
    signupBars,
    recentMembers,
    todayEmailNotifications,
    topSubscriptions,
    topCustomSubscriptions,
    lastUpdated,
    isLoading,
    refreshData,
    initFromCache,
  };
});
