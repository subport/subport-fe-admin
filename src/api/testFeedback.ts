import api from '.';
import type { GetTestFeedbacksParams, TestFeedbacksResponse } from './types';

const BASE = '/test-feedbacks';

export function getTestFeedbacks(params?: GetTestFeedbacksParams) {
  return api.get<TestFeedbacksResponse>(BASE, { params });
}
