import apiClient from '../../config/api';
import { CategoryResponse, UpdateCategoryRequest } from './category.interfaces';

export async function updateCategory(
  id: number,
  updateCategoryRequest: UpdateCategoryRequest,
): Promise<CategoryResponse> {
  const { data } = await apiClient.put(
    `/categories/${id}`,
    updateCategoryRequest,
  );
  return data;
}
