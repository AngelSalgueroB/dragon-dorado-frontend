import apiClient from '../../config/api';
import { ClientResponse, UpdateClientRequest } from './clients.interfaces';

export async function updateClient(
  id: number,
  updateClientRequest: UpdateClientRequest,
): Promise<ClientResponse> {
  const { data } = await apiClient.put(`/clients/${id}`, updateClientRequest);
  return data;
}
