import api from '.';
import type { DashboardStatsResponse } from './types';

const BASE = '/dashboard';

export function getStats() {
  return api.get<DashboardStatsResponse>(`${BASE}/stats`);
}
