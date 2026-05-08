import apiClient from '../../config/api';
import { MessageResponse } from '../common';
import { CreateUserRequest } from './users.interfaces';

export async function createUser(
  createUserRequest: CreateUserRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    '/users',
    createUserRequest,
  );
  return data;
}
