import api from '.';
import type { CreatePlanRequest, PlansResponse, UpdatePlanRequest } from './types';

const BASE = '/plans';

export function getPlans(subscriptionId: number) {
  return api.get<PlansResponse>(`/subscriptions/${subscriptionId}${BASE}`);
}

export function registerPlan(subscriptionId: number, data: CreatePlanRequest) {
  return api.post(`/subscriptions/${subscriptionId}${BASE}`, data);
}

export function updatePlan(planId : number, data: UpdatePlanRequest) {
  return api.put(`${BASE}/${planId}`, data)
}
