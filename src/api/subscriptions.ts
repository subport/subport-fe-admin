import api from '.';
import type {
  RegisterSubscriptionRequest,
  Subscription,
  SubscriptionsResponse,
  UpdateSubscriptionRequest,
} from './types';

const BASE = '/subscriptions';

export function getSubscriptions() {
  return api.get<SubscriptionsResponse>(BASE);
}

export function getSubscription(subscriptionId: number) {
  return api.get<Subscription>(`${BASE}/${subscriptionId}`);
}

export function registerSubscription(
  subscriptionId: number,
  data: RegisterSubscriptionRequest,
) {
  const formData = new FormData();

  const jsonBlob = new Blob(
    [
      JSON.stringify({
        name: data.name,
        type: data.type,
        planUrl: data.planUrl || undefined,
      }),
    ],
    { type: 'application/json' },
  );

  formData.append('request', jsonBlob);

  if (data.image) {
    formData.append('image', data.image);
  }

  return api.post(BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function updateSubscription(
  subscriptionId: number,
  data: UpdateSubscriptionRequest,
) {
  const formData = new FormData();

  const jsonBlob = new Blob(
    [
      JSON.stringify({
        name: data.name,
        type: data.type,
        planUrl: data.planUrl || undefined,
      }),
    ],
    { type: 'application/json' },
  );

  formData.append('request', jsonBlob);

  if (data.image) {
    formData.append('image', data.image);
  }

  return api.put(`${BASE}/${subscriptionId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function deleteSubscription(subscriptionId: number) {
  return api.delete(`${BASE}/${subscriptionId}`);
}
