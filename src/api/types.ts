export interface SubscriptionsResponse {
  subscriptions: Subscription[];
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
