import api from '.';
import type { FaqsResponse } from './types';

const BASE = '/faqs';

export function getFaqs() {
  return api.get<FaqsResponse>(BASE);
}
