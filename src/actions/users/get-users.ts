import apiClient from '../../config/api';
import { GetUsersParams, UserResponse } from './users.interfaces';

export async function getUsers(
  params: GetUsersParams,
): Promise<UserResponse[]> {
  const { data } = await apiClient.get<UserResponse[]>('/users', { params });
  return data;
}
