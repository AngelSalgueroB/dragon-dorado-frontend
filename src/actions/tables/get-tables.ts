import apiClient from '../../config/api';
import { GetTablesParams, TableResponse } from './tables.interfaces';

export async function getTables(
  params: GetTablesParams,
): Promise<TableResponse[]> {
  const { data } = await apiClient.get<TableResponse[]>('/tables', { params });
  return data;
}
