import apiClient from '../../config/api';
import { ProductResponse, UpdateProductRequest } from './products.interfaces';

export async function updateProduct(
  productId: number,
  request: UpdateProductRequest,
): Promise<ProductResponse> {
  const { data } = await apiClient.put<ProductResponse>(
    `/products/${productId}`,
    request,
  );

  return data;
}
