import apiClient from '../../config/api';
import { ProductResponse } from './products.interfaces';

export async function getMenu(): Promise<ProductResponse[]> {
  const { data } = await apiClient.get<ProductResponse[]>('/products/menu');
  return data;
}
