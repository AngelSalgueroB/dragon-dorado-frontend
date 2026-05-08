import apiClient from '../../config/api';
import {
  DeliveryDriverResponse,
  UpdateDeliveryDriverRequest,
} from './delivery-drivers.interface';

export async function updateDeliveryDriver(
  id: number,
  updateDeliveryDriverRequest: UpdateDeliveryDriverRequest,
): Promise<DeliveryDriverResponse> {
  const { data } = await apiClient.put<DeliveryDriverResponse>(
    `/delivery-drivers/${id}`,
    updateDeliveryDriverRequest,
  );
  return data;
}
