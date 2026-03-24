import api from '.';
import type { FeedbacksResponse, GetFeedbacksParams } from './types';

const BASE = '/feedbacks';

export function getFeedbacks(params?: GetFeedbacksParams) {
  return api.get<FeedbacksResponse>(BASE, { params });
}
