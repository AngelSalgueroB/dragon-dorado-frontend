import apiClient from '../../config/api';
import {
  DashboardDataResponse,
  DashboardOrderStatusResponse,
  DashboardOrderTypeResponse,
  DashboardPaymentMethodResponse,
  DashboardSalesTrendResponse,
  DashboardSummaryResponse,
  DashboardTopProductResponse,
  GetOrdersByStatusParams,
  GetRecentOrdersParams,
  GetSalesByOrderTypeParams,
  GetSalesByPaymentMethodParams,
  GetSalesTrendParams,
  GetTopProductsParams,
  GetDashboardSummaryParams,
} from './dashboard.interfaces';
import { OrderResponse } from '../orders/orders.interface';

export async function getDashboardSummary(params?: GetDashboardSummaryParams) {
  const response = await apiClient.get<DashboardSummaryResponse>(
    '/dashboard/summary',
    { params },
  );

  return response.data;
}

export async function getDashboardOrdersByStatus(
  params?: GetOrdersByStatusParams,
) {
  const response = await apiClient.get<DashboardOrderStatusResponse[]>(
    '/dashboard/orders-by-status',
    { params },
  );

  return response.data;
}

export async function getDashboardSalesByOrderType(
  params?: GetSalesByOrderTypeParams,
) {
  const response = await apiClient.get<DashboardOrderTypeResponse[]>(
    '/dashboard/sales-by-order-type',
    { params },
  );

  return response.data;
}

export async function getDashboardSalesByPaymentMethod(
  params?: GetSalesByPaymentMethodParams,
) {
  const response = await apiClient.get<DashboardPaymentMethodResponse[]>(
    '/dashboard/sales-by-payment-method',
    { params },
  );

  return response.data;
}

export async function getDashboardTopProducts(params?: GetTopProductsParams) {
  const response = await apiClient.get<DashboardTopProductResponse[]>(
    '/dashboard/top-products',
    { params },
  );

  return response.data;
}

export async function getDashboardSalesTrend(params?: GetSalesTrendParams) {
  const response = await apiClient.get<DashboardSalesTrendResponse[]>(
    '/dashboard/sales-trend',
    { params },
  );

  return response.data;
}

export async function getDashboardRecentOrders(params?: GetRecentOrdersParams) {
  const response = await apiClient.get<OrderResponse[]>(
    '/dashboard/recent-orders',
    { params },
  );

  return response.data;
}

export async function getDashboardData(params: {
  startDate?: string;
  endDate?: string;
  orderType?: GetOrdersByStatusParams['orderType'];
  trendGroupBy?: GetSalesTrendParams['groupBy'];
}): Promise<DashboardDataResponse> {
  const baseParams = {
    startDate: params.startDate,
    endDate: params.endDate,
  };

  const orderTypeParams = {
    ...baseParams,
    orderType: params.orderType,
  };

  const [
    summary,
    ordersByStatus,
    salesByOrderType,
    salesByPaymentMethod,
    topProducts,
    salesTrend,
    recentOrders,
  ] = await Promise.all([
    getDashboardSummary(baseParams),
    getDashboardOrdersByStatus(orderTypeParams),
    getDashboardSalesByOrderType(baseParams),
    getDashboardSalesByPaymentMethod(orderTypeParams),
    getDashboardTopProducts({ ...orderTypeParams, limit: 8 }),
    getDashboardSalesTrend({
      ...orderTypeParams,
      groupBy: params.trendGroupBy ?? 'day',
    }),
    getDashboardRecentOrders({ ...orderTypeParams, limit: 8 }),
  ]);

  return {
    summary,
    ordersByStatus,
    salesByOrderType,
    salesByPaymentMethod,
    topProducts,
    salesTrend,
    recentOrders,
  };
}
