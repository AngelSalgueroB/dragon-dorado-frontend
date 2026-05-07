import apiClient from '../../config/api';
import {
  CreateDeliveryDriverRequest,
  DeliveryDriverResponse,
} from './delivery-drivers.interface';

export async function createDeliveryDriver(
  request: CreateDeliveryDriverRequest,
): Promise<DeliveryDriverResponse> {
  const { data } = await apiClient.post<DeliveryDriverResponse>(
    '/delivery-drivers',
    request,
  );
  return data;
}
