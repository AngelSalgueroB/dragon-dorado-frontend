import apiClient from '../../config/api';
import { ClientResponse, CreateClientRequest } from './clients.interfaces';

export async function createClient(
  createClientRequest: CreateClientRequest,
): Promise<ClientResponse> {
  const { data } = await apiClient.post('/clients', createClientRequest);
  return data;
}
