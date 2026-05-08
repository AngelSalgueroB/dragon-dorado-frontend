import apiClient from '../../config/api';
import { MessageResponse } from '../common';
import { ChangePasswordRequest } from './users.interfaces';

export async function changePassword(
  changePasswordRequest: ChangePasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.patch<MessageResponse>(
    '/users/me/password',
    changePasswordRequest,
  );
  return data;
}
