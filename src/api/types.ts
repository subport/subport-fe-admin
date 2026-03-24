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

export interface SignupTrendsResponse {
  signupTrends: SignupTrend[];
}

export interface SignupTrend {
  date: string;
  newMemberCount: number;
}

export interface RecentMembersResponse {
  members: RecentMember[];
}

export interface RecentMember {
  nickname: string;
  email: string;
  memberSubscriptionCount: number;
  createdAt: string;
}

export interface TopSubscriptionsResponse {
  topSubscriptions: TopSubscription[];
}

export interface TopSubscription {
  subscriptionName: string;
  subscriptionLogoImageUrl: string;
  memberCount: number;
}

export interface TopCustomSubscriptionsResponse {
  topCustomSubscriptions: TopCustomSubscription[];
}

export interface TopCustomSubscription {
  normalizedSubscriptionName: string;
  memberCount: number;
}

export interface TodayEmailNotificationsResponse {
  notifications: TodayEmailNotification[];
  successCount: number;
  failedCount: number;
  pendingCount: number;
}

export interface TodayEmailNotification {
  recipientEmail: string;
  subscriptionCount: number;
  daysBeforePayment: number;
  status: string;
  sentAt: string;
}

// 회원 목록
export interface MembersResponse {
  members: Member[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface Member {
  id: number;
  email: string;
  nickname: string;
  memberSubscriptionCount: number;
  customSubscriptionCount: number;
  paymentReminderEnabled: boolean;
  reminderDaysBefore: number;
  lastActiveAt: string;
  createdAt: string;
  deleted: boolean;
}

export interface GetMembersParams {
  page: number;
  size: number;
  sort?: string;
  deleted?: boolean;
  reminderEnabled?: boolean;
  email?: string;
}

// 이메일 발송 목록
export interface EmailNotificationsResponse {
  notifications: EmailNotification[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface EmailNotification {
  email: string;
  paymentDate: string; // LocalDate
  daysBeforePayment: number; // 1 or 3만 존재
  status: string; // PENDING, FAILED, SENT
  retryCount: number; // status가 FAILED일 때만 표기, 총 시도 횟수는 3회 고정
  sentAt: string; // LocalDateTime
  subscriptions: SubscriptionInEmailNotification[];
}

export interface SubscriptionInEmailNotification {
  logoImageUrl: string;
  name: string;
  amount: string; // "#,###" 형태로 넘어온 상태
  amountUnit: string; // 그대로 사용
}

export interface GetEmailNotificationsParams {
  page: number;
  size: number; // 지금은 15 고정
  sort?: string;
  date?: string;
  status?: string;
  daysBeforePayment?: number;
  email?: string;
}

// 인증
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
}

// 어드민 계정
export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  nickname: string;
  email: string;
}

// FAQ
export interface FaqsResponse {
  faqs: Faq[];
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface WriteFaqRequest {
  question: string;
  answer: string;
}

export interface UpdateFaqRequest {
  question: string;
  answer: string;
}

// 피드백
export interface FeedbacksResponse {
  feedbacks: Feedback[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface Feedback {
  id: number;
  category: string;
  subCategory: string;
  content: string;
  createdAt: string;
}

export interface GetFeedbacksParams {
  page: number;
  size: number;
  date?: string;
  category?: string;
}

export interface TestFeedbacksResponse {
  testFeedbacks: TestFeedback[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface TestFeedback {
  id: number;
  overall: string;
  featureRequest: string;
  createdAt: string;
}

export interface GetTestFeedbacksParams {
  page: number;
  size: number;
  date?: string;
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

// API 에러 코드
export type ErrorCode =
  // 로그인 관련 (사용자에게 표시)
  | 'ADMIN_NOT_FOUND'
  | 'ADMIN_PASSWORD_MISMATCH'
  | 'ADMIN_CURRENT_PASSWORD_MISMATCH'
  // 구독/플랜 삭제 관련
  | 'SUBSCRIPTION_IN_USE'
  | 'PLAN_IN_USE'
  // 토큰 재발급/세션 관련 (내부 처리용)
  | 'ACCESS_TOKEN_EXPIRED'
  | 'REFRESH_TOKEN_EXPIRED';

// API 에러 응답 타입
export interface ApiErrorResponse {
  status: number;
  error: string;
  code: ErrorCode;
  message: string;
  fieldErrors: null | Record<string, string>;
}
