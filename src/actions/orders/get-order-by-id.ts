import apiClient from '../../config/api';
import { OrderFullResponse } from './orders.interface';

export async function getOrderById(
  orderId: number,
): Promise<OrderFullResponse> {
  const { data } = await apiClient.get<OrderFullResponse>(`/orders/${orderId}`);
  return data;
}
