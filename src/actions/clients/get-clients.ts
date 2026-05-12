import apiClient from '../../config/api';
import { PageResponse } from '../common';
import { ClientResponse, GetClientsParams } from './clients.interfaces';

export async function getClients(
  params: GetClientsParams,
): Promise<PageResponse<ClientResponse>> {
  const { data } = await apiClient.get('/clients', { params });
  return data;
}