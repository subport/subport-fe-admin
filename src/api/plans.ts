import api from '.';
import type { PlansResponse } from './types';

const BASE = '/plans';

export function getPlans(subscriptionId: number) {
  return api.get<PlansResponse>(`/subscriptions/${subscriptionId}${BASE}`);
}
