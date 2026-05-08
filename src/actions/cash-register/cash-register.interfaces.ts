import { PageableParams } from "../common";

export interface GetCashRegistersParams extends PageableParams {
  openingTime?: string;
  closingTime?: string;
  openingAmount?: number;
  closingAmount?: number;
  status?: CashRegisterStatus;
}

export enum CashRegisterStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface CashRegisterResponse {
  id: number;
  user: CashRegisterUser;

  openingTime: string;
  closingTime?: string;

  openingAmount: number;
  closingAmount?: number;

  status: CashRegisterStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CashRegisterUser {
  id: number;
  fullName: string;
}
