import apiClient from '../../config/api';
import { PageResponse } from '../common';
import { GetOrdersParams, OrderResponse } from './orders.interface';

export async function getOrders(
  params: GetOrdersParams,
): Promise<PageResponse<OrderResponse>> {
  const { data } = await apiClient.get<PageResponse<OrderResponse>>('/orders', {
    params,
  });
  return data;
}
