import apiClient from '../../config/api';
import { MessageResponse } from '../common';
import { UpdateUserActiveRequest } from './users.interfaces';

export async function updateUserActiveStatus(
  userId: number,
  request: UpdateUserActiveRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.patch<MessageResponse>(
    `/users/${userId}/active`,
    request,
  );
  return data;
}
