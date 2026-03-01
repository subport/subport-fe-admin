import api from '.';
import type {
  PlansResponse,
  RegisterPlanRequest,
  UpdatePlanRequest,
} from './types';

const BASE = '/plans';

export function getPlans(subscriptionId: number) {
  return api.get<PlansResponse>(`/subscriptions/${subscriptionId}${BASE}`);
}

export function registerPlan(
  subscriptionId: number,
  data: RegisterPlanRequest,
) {
  return api.post(`/subscriptions/${subscriptionId}${BASE}`, data);
}

export function updatePlan(planId: number, data: UpdatePlanRequest) {
  return api.put(`${BASE}/${planId}`, data);
}

export function deletePlan(planId: number) {
  return api.delete(`${BASE}/${planId}`);
}
