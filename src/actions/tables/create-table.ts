import apiClient from '../../config/api';
import { CreateTableRequest, TableResponse } from './tables.interfaces';

export async function createTable(
  createTableRequest: CreateTableRequest,
): Promise<TableResponse> {
  const { data } = await apiClient.post<TableResponse>(
    '/tables',
    createTableRequest,
  );
  return data;
}
