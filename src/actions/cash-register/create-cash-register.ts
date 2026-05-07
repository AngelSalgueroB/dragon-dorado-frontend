import apiClient from '../../config/api';
import { CashRegisterResponse } from './cash-register.interfaces';

export async function createCashRegister(
  openingAmount: number,
): Promise<CashRegisterResponse> {
  const { data } = await apiClient.post<CashRegisterResponse>(
    '/cash-registers',
    { openingAmount },
  );
  return data;
}
