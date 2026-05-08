import { DocumentType } from '../common';

export enum DeliveryPlatform {
  UBER_EATS = 'UBER_EATS',
  RAPPI = 'RAPPI',
  PEDIDOS_YA = 'PEDIDOS_YA',
  DIDI_FOOD = 'DIDI_FOOD',
  GLOVO = 'GLOVO',
  INTERNAL = 'INTERNAL',
}

export interface DeliveryDriverResponse {
  id: number;

  name: string;

  platform: DeliveryPlatform;

  phoneNumber: string;

  documentType: DocumentType;
  documentNumber: string;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface GetDeliveryDriversParams {
  name?: string;

  platform?: DeliveryPlatform;

  phoneNumber?: string;

  documentType?: DocumentType;
  documentNumber?: string;

  active?: boolean;
}

export interface CreateDeliveryDriverRequest {
  name: string;

  platform: DeliveryPlatform;

  phoneNumber: string;

  documentType: DocumentType;
  documentNumber: string;
}

export interface UpdateDeliveryDriverRequest {
  name: string;

  platform: DeliveryPlatform;

  phoneNumber: string;

  active: boolean;
}
