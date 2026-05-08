import apiClient from '../../config/api';
import { CategoryResponse } from './category.interfaces';

export async function getCategories(): Promise<CategoryResponse[]> {
  const { data } = await apiClient.get<CategoryResponse[]>('/categories');
  return data;
}
