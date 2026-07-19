import * as XLSX from 'xlsx';
import { DashboardDataResponse } from '../actions/dashboard/dashboard.interfaces';
import {
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../actions/orders/orders.interface';

const orderTypeLabel: Record<OrderType, string> = {
  [OrderType.DINE_IN]: 'Salón',
  [OrderType.TAKEAWAY]: 'Para llevar',
  [OrderType.DELIVERY]: 'Delivery',
};

const orderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.PREPARING]: 'Preparando',
  [OrderStatus.READY]: 'Lista',
  [OrderStatus.OUT_FOR_DELIVERY]: 'En reparto',
  [OrderStatus.DELIVERED]: 'Entregada',
  [OrderStatus.SERVED]: 'Servida',
  [OrderStatus.COMPLETED]: 'Completada',
  [OrderStatus.CANCELLED]: 'Cancelada',
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CREDIT_CARD]: 'Tarjeta crédito',
  [PaymentMethod.DEBIT_CARD]: 'Tarjeta débito',
  [PaymentMethod.YAPE]: 'Yape',
  [PaymentMethod.PLIN]: 'Plin',
  [PaymentMethod.DIGITAL_WALLET]: 'Billetera digital',
};

export interface DashboardExportFilters {
  startDate?: string;
  endDate?: string;
  orderType?: OrderType | '';
  trendGroupBy?: string;
}

function fileStamp() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
}

export function exportDashboardToExcel(
  data: DashboardDataResponse,
  filters: DashboardExportFilters = {},
) {
  const wb = XLSX.utils.book_new();

  const totalVentas =
    Number(data.summary.dineInTotal || 0) +
    Number(data.summary.takeawayTotal || 0) +
    Number(data.summary.deliveryTotal || 0);

  const totalOrders =
    Number(data.summary.dineInCount || 0) +
    Number(data.summary.takeawayCount || 0) +
    Number(data.summary.deliveryCount || 0);

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ['Dashboard - Exportación'],
    ['Desde', filters.startDate || ''],
    ['Hasta', filters.endDate || ''],
    [
      'Tipo de orden',
      filters.orderType
        ? orderTypeLabel[filters.orderType as OrderType]
        : 'Todos',
    ],
    ['Tendencia', filters.trendGroupBy || ''],
    [],
    ['Métrica', 'Valor'],
    ['Ventas totales', totalVentas],
    ['Órdenes totales', totalOrders],
    [
      'Ticket promedio',
      totalOrders > 0 ? Number((totalVentas / totalOrders).toFixed(2)) : 0,
    ],
    [],
    ['Canal', 'Total (S/)', 'Cantidad'],
    ['Salón', data.summary.dineInTotal, data.summary.dineInCount],
    ['Para llevar', data.summary.takeawayTotal, data.summary.takeawayCount],
    ['Delivery', data.summary.deliveryTotal, data.summary.deliveryCount],
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen');

  const statusSheet = XLSX.utils.json_to_sheet(
    data.ordersByStatus.map((row) => ({
      Estado: orderStatusLabel[row.status] ?? row.status,
      Cantidad: row.orderCount,
      Total: row.total,
    })),
  );
  XLSX.utils.book_append_sheet(wb, statusSheet, 'Por estado');

  const orderTypeSheet = XLSX.utils.json_to_sheet(
    data.salesByOrderType.map((row) => ({
      Tipo: orderTypeLabel[row.orderType] ?? row.orderType,
      Cantidad: row.orderCount,
      Total: row.total,
    })),
  );
  XLSX.utils.book_append_sheet(wb, orderTypeSheet, 'Por tipo');

  const paymentSheet = XLSX.utils.json_to_sheet(
    data.salesByPaymentMethod.map((row) => ({
      Método: paymentMethodLabel[row.paymentMethod] ?? row.paymentMethod,
      Cantidad: row.paymentCount,
      Total: row.total,
    })),
  );
  XLSX.utils.book_append_sheet(wb, paymentSheet, 'Por pago');

  const productsSheet = XLSX.utils.json_to_sheet(
    data.topProducts.map((row) => ({
      Producto: row.productName,
      'Cantidad vendida': row.quantitySold,
      Total: row.total,
    })),
  );
  XLSX.utils.book_append_sheet(wb, productsSheet, 'Top productos');

  const trendSheet = XLSX.utils.json_to_sheet(
    data.salesTrend.map((row) => ({
      Periodo: row.period,
      Cantidad: row.orderCount,
      Total: row.total,
    })),
  );
  XLSX.utils.book_append_sheet(wb, trendSheet, 'Tendencia');

  const ordersSheet = XLSX.utils.json_to_sheet(
    data.recentOrders.map((order) => ({
      ID: order.id,
      Comprobante: order.invoiceNumber ?? '',
      Tipo: orderTypeLabel[order.orderType] ?? order.orderType,
      Estado: orderStatusLabel[order.status] ?? order.status,
      Total: order.total,
      Fecha: order.createdAt,
    })),
  );
  XLSX.utils.book_append_sheet(wb, ordersSheet, 'Ordenes recientes');

  XLSX.writeFile(wb, `dashboard_${fileStamp()}.xlsx`);
}
