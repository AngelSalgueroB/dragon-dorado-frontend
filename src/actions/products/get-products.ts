import apiClient from '../../config/api';
import { PageResponse } from '../common';
import { GetProductsParams, ProductResponse } from './products.interfaces';

export async function getProducts(
  params?: GetProductsParams,
): Promise<PageResponse<ProductResponse>> {
  const { data } = await apiClient.get<PageResponse<ProductResponse>>(
    '/products',
    {
      params,
    },
  );

  return data;
}
