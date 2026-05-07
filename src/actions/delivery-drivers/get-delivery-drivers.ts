import apiClient from '../../config/api';
import {
  DeliveryDriverResponse,
  GetDeliveryDriversParams,
} from './delivery-drivers.interface';

export async function getDeliveryDrivers(
  params: GetDeliveryDriversParams,
): Promise<DeliveryDriverResponse[]> {
  const { data } = await apiClient.get<DeliveryDriverResponse[]>(
    '/delivery-drivers',
    { params },
  );
  return data;
}
