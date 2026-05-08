import apiClient from '../../config/api';

export async function getOrderPreCheck(orderId: number): Promise<Blob> {
  const { data } = await apiClient.get(`/orders/${orderId}/pre-check`, {
    responseType: 'blob',
  });

  return data;
}
