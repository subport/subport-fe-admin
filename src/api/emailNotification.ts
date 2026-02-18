import api from '.';
import type {
  EmailNotificationsResponse,
  GetEmailNotificationsParams,
} from './types';

const BASE = '/email-notifications';

export function getEmailNotifications(params?: GetEmailNotificationsParams) {
  return api.get<EmailNotificationsResponse>(BASE, { params });
}
