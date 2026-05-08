import apiClient from '../../config/api';
import { CategoryResponse, CreateCategoryRequest } from './category.interfaces';

export async function createCategory(
  createCategoryRequest: CreateCategoryRequest,
): Promise<CategoryResponse> {
  const { data } = await apiClient.post<CategoryResponse>(
    '/categories',
    createCategoryRequest,
  );
  return data;
}
