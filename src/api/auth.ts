import api from '.';
import type { LoginRequest, TokenResponse } from './types';

const BASE = '/auth';

export function login(data: LoginRequest) {
  return api.post<TokenResponse>(`${BASE}/login`, data, {
    withCredentials: true,
  });
}

export function refresh() {
  return api.post<TokenResponse>(
    `${BASE}/refresh`,
    {},
    {
      withCredentials: true,
    },
  );
}

export function logout() {
  return api.post(
    `${BASE}/logout`,
    {},
    {
      withCredentials: true,
    },
  );
}
