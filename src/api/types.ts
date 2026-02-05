export interface SubscriptionResponse {
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
