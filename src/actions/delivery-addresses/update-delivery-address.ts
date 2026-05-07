import apiClient from '../../config/api';
import {
  DeliveryAddressResponse,
  UpdateDeliveryAddressRequest,
} from './delivery-addresses.interfaces';

export async function updateDeliveryAddress(
  id: number,
  updateData: UpdateDeliveryAddressRequest,
): Promise<DeliveryAddressResponse> {
  const { data } = await apiClient.put(`/delivery-addresses/${id}`, updateData);
  return data;
}
