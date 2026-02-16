import api from '.';
import type { DashboardStatsResponse, SignupTrendResponse } from './types';

const BASE = '/dashboard';

export function getStats() {
  return api.get<DashboardStatsResponse>(`${BASE}/stats`);
}

export function getSignUpTrend() {
  return api.get<SignupTrendResponse>(`${BASE}/signup-trend`);
}
