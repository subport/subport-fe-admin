import api from '.';
import type {
  DashboardStatsResponse,
  RecentMembersResponse,
  SignupTrendsResponse,
  TopCustomSubscriptionsResponse,
  TopSubscriptionsResponse,
} from './types';

const BASE = '/dashboard';

export function getStats() {
  return api.get<DashboardStatsResponse>(`${BASE}/stats`);
}

export function getSignUpTrend() {
  return api.get<SignupTrendsResponse>(`${BASE}/signup-trend`);
}

export function getRecentMembers() {
  return api.get<RecentMembersResponse>(`${BASE}/recent-members`);
}

export function getTopSubscriptions() {
  return api.get<TopSubscriptionsResponse>(`${BASE}/top-subscriptions`);
}

export function getTopCustomSubscriptions() {
  return api.get<TopCustomSubscriptionsResponse>(
    `${BASE}/top-custom-subscriptions`,
  );
}
