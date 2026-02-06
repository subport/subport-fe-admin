import { createRouter, createWebHistory } from 'vue-router';
import SubscriptionListView from '@/views/subscription/SubscriptionListView.vue';
import SubscriptionDetailView from '@/views/subscription/SubscriptionDetailView.vue';

const routes = [
  {
    path: '/subscriptions',
    component: SubscriptionListView,
  },
  {
    path: '/subscriptions/:id',
    component: SubscriptionDetailView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
