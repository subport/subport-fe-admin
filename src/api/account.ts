import api from '.';
import type { ProfileResponse, UpdatePasswordRequest } from './types';

const BASE = '/account';

export function updatePassword(data: UpdatePasswordRequest) {
  return api.put(`${BASE}/password`, data);
}

export function getProfile() {
  return api.get<ProfileResponse>(`${BASE}/profile`);
}
