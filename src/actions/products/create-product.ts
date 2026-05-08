import apiClient from '../../config/api';
import { CreateProductRequest, ProductResponse } from './products.interfaces';

export async function createProduct(
  request: CreateProductRequest,
  image: File,
): Promise<ProductResponse> {
  const formData = new FormData();

  formData.append(
    'data',
    new Blob([JSON.stringify(request)], {
      type: 'application/json',
    }),
  );

  formData.append('image', image);

  const { data } = await apiClient.post<ProductResponse>('/products', formData);

  return data;
}
