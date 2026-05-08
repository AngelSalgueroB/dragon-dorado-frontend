import apiClient from '../../config/api';
import { LoginRequest, JwtResponse } from './auth.interfaces';

export async function login(loginRequest: LoginRequest): Promise<JwtResponse> {
  const { data } = await apiClient.post<JwtResponse>(
    '/auth/login',
    loginRequest,
  );
  return data;
}
