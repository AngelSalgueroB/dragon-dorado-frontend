import apiClient from '../../config/api';
import { PageableParams } from '../common';
import { TableResponse } from './tables.interfaces';

export async function getTables(
  params: PageableParams,
): Promise<TableResponse[]> {
  const { data } = await apiClient.get<TableResponse[]>('/tables', { params });
  return data;
}
