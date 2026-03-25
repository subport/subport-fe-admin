import api from '.';
import {
  type EmailNotificationDetailResponse,
  type EmailNotificationsResponse,
  type GetEmailNotificationDetailsParams,
  type GetEmailNotificationsParams,
} from './types';

const BASE = '/email-notifications';

export function getEmailNotifications(params?: GetEmailNotificationsParams) {
  return api.get<EmailNotificationsResponse>(BASE, { params });
}

export function getEmailNotificationDetails(
  params?: GetEmailNotificationDetailsParams,
) {
  return api.get<EmailNotificationDetailResponse[]>(`${BASE}/details`, {
    params,
  });
}
