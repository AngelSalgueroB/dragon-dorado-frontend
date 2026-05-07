import apiClient from '../../config/api';
import { TableResponse, UpdateTableRequest } from './tables.interfaces';

export async function updateTable(
  id: number,
  updateTableRequest: UpdateTableRequest,
): Promise<TableResponse> {
  const { data } = await apiClient.put<TableResponse>(`/tables/${id}`, updateTableRequest);
  return data;
}
