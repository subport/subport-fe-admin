import api from '.';
import type { Subscription, SubscriptionsResponse } from './types';

const BASE = '/subscriptions';

export function getSubscriptions() {
  return api.get<SubscriptionsResponse>(BASE);
}

export function getSubscription(subscriptionId: number) {
  return api.get<Subscription>(`${BASE}/${subscriptionId}`);
}
