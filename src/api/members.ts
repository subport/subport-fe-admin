import api from '.';
import type { GetMembersParams, MembersResponse } from './types';

const BASE = '/members';

export function getMembers(params?: GetMembersParams) {
  return api.get<MembersResponse>(BASE, { params });
}
