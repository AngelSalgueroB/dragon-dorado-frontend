import apiClient from '../../config/api';
import { AccountActivationTokenRequest, JwtResponse } from './auth.interfaces';

export async function activateAccount(
  accountActivationTokenRequest: AccountActivationTokenRequest,
): Promise<JwtResponse> {
  const { data } = await apiClient.post<JwtResponse>(
    '/auth/activate',
    accountActivationTokenRequest,
  );
  return data;
}
