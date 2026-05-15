import apiClient from '../../config/api';
import { OrderResponse } from './orders.interface';

export async function getPosOrders(): Promise<OrderResponse[]> {
  const response = await apiClient.get<OrderResponse[]>('/orders/pos');
  return response.data;
}
