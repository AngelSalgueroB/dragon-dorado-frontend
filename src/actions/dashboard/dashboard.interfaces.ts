import { OrderResponse, OrderStatus, OrderType, PaymentMethod } from '../orders/orders.interface';

export interface DashboardSummaryResponse {
  dineInTotal: number;
  dineInCount: number;

  takeawayTotal: number;
  takeawayCount: number;

  deliveryTotal: number;
  deliveryCount: number;
}

export interface DashboardDateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface GetDashboardSummaryParams extends DashboardDateRangeParams {}

export interface GetOrdersByStatusParams extends DashboardDateRangeParams {
  orderType?: OrderType;
}

export interface GetSalesByOrderTypeParams extends DashboardDateRangeParams {
  status?: OrderStatus;
}

export interface GetSalesByPaymentMethodParams extends DashboardDateRangeParams {
  orderType?: OrderType;
}

export interface GetTopProductsParams extends DashboardDateRangeParams {
  status?: OrderStatus;
  orderType?: OrderType;
  limit?: number;
}

export type DashboardTrendGroupBy = 'hour' | 'day' | 'month';

export interface GetSalesTrendParams extends DashboardDateRangeParams {
  orderType?: OrderType;
  groupBy?: DashboardTrendGroupBy;
}

export interface GetRecentOrdersParams extends DashboardDateRangeParams {
  status?: OrderStatus;
  orderType?: OrderType;
  limit?: number;
}

export interface DashboardOrderStatusResponse {
  status: OrderStatus;
  orderCount: number;
  total: number;
}

export interface DashboardOrderTypeResponse {
  orderType: OrderType;
  orderCount: number;
  total: number;
}

export interface DashboardPaymentMethodResponse {
  paymentMethod: PaymentMethod;
  paymentCount: number;
  total: number;
}

export interface DashboardTopProductResponse {
  productId: number;
  productName: string;
  quantitySold: number;
  total: number;
}

export interface DashboardSalesTrendResponse {
  period: string;
  orderCount: number;
  total: number;
}

export interface DashboardDataResponse {
  summary: DashboardSummaryResponse;
  ordersByStatus: DashboardOrderStatusResponse[];
  salesByOrderType: DashboardOrderTypeResponse[];
  salesByPaymentMethod: DashboardPaymentMethodResponse[];
  topProducts: DashboardTopProductResponse[];
  salesTrend: DashboardSalesTrendResponse[];
  recentOrders: OrderResponse[];
}
