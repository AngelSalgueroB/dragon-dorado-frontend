import apiClient from '../../config/api';
import { JwtResponse } from './auth.interfaces';

export async function refreshToken(refreshToken: string): Promise<JwtResponse> {
  const { data } = await apiClient.post<JwtResponse>('/auth/refresh', {
    refreshToken,
  });
  return data;
}
