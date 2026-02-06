import api from '.';
import type { SubscriptionsResponse } from './types';

const BASE = '/subscriptions';

export function getSubscriptions() {
  return api.get<SubscriptionsResponse>(BASE);
}
