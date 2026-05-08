import apiClient from '../../config/api';
import { PageResponse } from '../common/pagination.interfaces';
import {
  CashRegisterResponse,
  GetCashRegistersParams,
} from './cash-register.interfaces';

export async function getCashRegisters(
  params: GetCashRegistersParams,
): Promise<PageResponse<CashRegisterResponse>> {
  const { data } = await apiClient.get<PageResponse<CashRegisterResponse>>(
    '/cash-registers',
    { params },
  );
  return data;
}
