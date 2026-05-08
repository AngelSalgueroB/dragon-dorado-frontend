import apiClient from '../../config/api';
import { DeliveryAddressResponse } from './delivery-addresses.interfaces';

export async function getDeliveryAddress(
  id: number,
): Promise<DeliveryAddressResponse> {
  const { data } = await apiClient.get(`/delivery-addresses/${id}`);
  return data;
}
