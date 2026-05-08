import { ClientResponse } from "../clients/clients.interfaces";
import { PageableParams } from "../common";
import { DeliveryAddressResponse } from "../delivery-addresses/delivery-addresses.interfaces";
import { DeliveryDriverResponse, DeliveryPlatform } from "../delivery-drivers/delivery-drivers.interface";
import { TableResponse, TableStatus } from "../tables/tables.interfaces";
import { UserResponse } from "../users/users.interfaces";

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  YAPE = 'YAPE',
  PLIN = 'PLIN',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
}

export interface PaymentResponse {
  id: number;

  paymentMethod: PaymentMethod;

  total: number;

  details: string;

  transactionDate: string;
}

export interface OrderItemResponse {
  id: number;

  quantity: number;

  unitPrice: number;

  productName: string;

  subTotal: number;

  details: string;
}


export interface OrderResponse {
  id: number;

  user: UserResponse;

  client: ClientResponse;

  status: OrderStatus;

  details: string;

  orderType: OrderType;

  subtotal: number;
  total: number;

  invoiceNumber: string;

  table: TableResponse;

  deliveryAddress: DeliveryAddressResponse;

  deliveryDriver: DeliveryDriverResponse;

  payment: PaymentResponse;

  createdAt: string;
  updatedAt: string;
}

export interface OrderFullResponse {
  id: number;

  user: UserResponse;

  client: ClientResponse;

  status: OrderStatus;

  details: string;

  orderType: OrderType;

  subtotal: number;
  total: number;

  invoiceNumber: string;

  table: TableResponse;

  deliveryAddress: DeliveryAddressResponse;

  deliveryDriver: DeliveryDriverResponse;

  payment: PaymentResponse;

  items: OrderItemResponse[];

  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersParams extends PageableParams {
  // user
  fullName?: string;

  // client
  clientName?: string;
  clientPhoneNumber?: string;

  // order
  status?: OrderStatus;
  orderType?: OrderType;

  minTotal?: number;
  maxTotal?: number;

  invoiceNumber?: string;

  minDate?: string;
  maxDate?: string;

  // table
  tableNumber?: number;
  tableName?: string;
  tableStatus?: TableStatus;

  // delivery address
  deliveryAddressPhoneNumber?: string;
  deliveryAddressDirection?: string;

  // delivery driver
  deliveryDriverName?: string;
  deliveryDriverPhoneNumber?: string;

  deliveryDriverPlatform?: DeliveryPlatform;

  deliveryDriverDocumentType?: DocumentType;
  deliveryDriverDocumentNumber?: string;

  // payments
  paymentMethod?: PaymentMethod;

  minTransactionDate?: string;
  maxTransactionDate?: string;
}