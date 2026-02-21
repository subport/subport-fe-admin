import api from '.';
import type { FaqsResponse, UpdateFaqRequest, WriteFaqRequest } from './types';

const BASE = '/faqs';

export function getFaqs() {
  return api.get<FaqsResponse>(BASE);
}

export function writeFaq(data: WriteFaqRequest) {
  return api.post(BASE, data);
}

export function updateFaq(faqId: number, data: UpdateFaqRequest) {
  return api.put(`${BASE}/${faqId}`, data);
}

export function deleteFaq(faqId: number) {
  return api.delete(`${BASE}/${faqId}`);
}
