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

export interface UpdateSubscriptionRequest {
  name: string;
  type: string;
  planUrl?: string;
  logoImage?: File;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface Plan {
  id: number;
  name: string;
  amount: string;
  amountUnit: string;
  durationMonths: number;
  createdAt: string;
  lastModifiedAt: string;
}

export interface RegisterPlanRequest {
  name: string;
  amount: string;
  amountUnit: string;
  durationMonths: number;
}

export interface UpdatePlanRequest {
  name: string;
  amount: string;
  amountUnit: string;
  durationMonths: number;
}
