export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface Subscription {
  id: number;
  name: string;
  type: string;
  logoImageUrl: string;
  planUrl: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface GetSubscriptionsParams {
  page: number;
  size: number;
  type?: string;
  sort?: string;
  name?: string;
}

export interface RegisterSubscriptionRequest {
  name: string;
  type: string;
  planUrl?: string;
  image?: File;
}

export interface UpdateSubscriptionRequest {
  name: string;
  type: string;
  planUrl?: string;
  image?: File;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface Plan {
  id: number;
  name: string;
  amount: number;
  amountUnit: string;
  durationMonths: number;
  createdAt: string;
  lastModifiedAt: string;
}

export interface RegisterPlanRequest {
  name: string;
  amount: number;
  amountUnit: string;
  durationMonths: number;
}

export interface UpdatePlanRequest {
  name: string;
  amount: number;
  amountUnit: string;
  durationMonths: number;
}

export interface PlanForm {
  name: string;
  amount: number;
  amountUnit: string;
  durationMonths: number;
}

// 대시보드
export interface DashboardStatsResponse {
  totalMemberCount: number;
  weeklyNewMemberCount: number;
  todayNewMemberCount: number;
  yesterdayNewMemberCount: number;
  totalMemberSubscriptionCount: number;
  weeklyNewMemberSubscriptionCount: number;
  currentActiveMemberCount: number;
}

// 상수
export const SUBSCRIPTION_TYPES = [
  'OTT',
  '음원 스트리밍',
  '동영상 스트리밍',
  'AI',
  '쇼핑',
  '배달/음식',
  '도서',
  '메신저',
  'VPN',
  '크리에이티브 툴',
  '클라우드',
  '기타',
];

export const AMOUNT_UNITS = ['KRW', 'USD'];
