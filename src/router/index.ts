import DashboardView from '@/views/dashboard/DashboardView.vue';
import EmailNotificationListView from '@/views/emailnotification/EmailNotificationListView.vue';
import FaqListView from '@/views/faq/FaqListView.vue';
import FeedbackListView from '@/views/feedback/FeedbackListView.vue';
import LoginView from '@/views/LoginView.vue';
import MemberListView from '@/views/member/MemberListView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import SubscriptionDetailView from '@/views/subscription/SubscriptionDetailView.vue';
import SubscriptionListView from '@/views/subscription/SubscriptionListView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // ── 인증 (네브바·헤더 없음) ──────────────────────
  {
    path: '/login',
    component: LoginView,
    meta: { layout: 'auth' },
  },

  // ── 어드민 페이지 ────────────────────────────────
  {
    path: '/',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/subscriptions',
    component: SubscriptionListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/subscriptions/:id',
    component: SubscriptionDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/email-notifications',
    component: EmailNotificationListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/members',
    component: MemberListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/faqs',
    component: FaqListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/feedbacks',
    component: FeedbackListView,
    meta: { requiresAuth: true },
  },

  // ── 404 ─────────────────────────────────────────
  {
    path: '/:pathMatch(.*)',
    component: NotFoundView,
    meta: { layout: 'auth' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ── 네비게이션 가드 ──────────────────────────────────
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('accessToken');
  const isAuthenticated = !!token;

  // 인증 필요 페이지인데 비로그인 → 로그인으로
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  // 이미 로그인된 상태에서 /login 접근 → 대시보드로
  if (to.path === '/login' && isAuthenticated) {
    return next('/dashboard');
  }

  next();
});

export default router;
