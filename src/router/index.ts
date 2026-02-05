import { createRouter, createWebHistory } from 'vue-router';
import SubscriptionsView from '@/views/subscription/SubscriptionsView.vue';

const routes = [
  {
    path: '/subscriptions',
    component: SubscriptionsView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
