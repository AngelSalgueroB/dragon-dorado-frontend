import { Eye, FileText } from 'lucide-react';
import {
  OrderResponse,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../../actions/orders/orders.interface';

interface OrdersTableProps {
  orders: OrderResponse[];
  loading: boolean;
  onView: (order: OrderResponse) => void;
  onPreCheck: (order: OrderResponse) => void;
}

export const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  [OrderStatus.PENDING]: {
    label: 'Pendiente',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
  },
  [OrderStatus.PREPARING]: {
    label: 'Preparando',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500 animate-pulse',
  },
  [OrderStatus.READY]: {
    label: 'Listo',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    label: 'En camino',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500 animate-pulse',
  },
  [OrderStatus.DELIVERED]: {
    label: 'Entregado',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
  },
  [OrderStatus.SERVED]: {
    label: 'Servido',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completado',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelado',
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
  },
};

export const orderTypeConfig: Record<
  OrderType,
  { label: string; color: string }
> = {
  [OrderType.DINE_IN]: {
    label: 'Salón',
    color: 'bg-emerald-100 text-emerald-700',
  },
  [OrderType.TAKEAWAY]: {
    label: 'Para llevar',
    color: 'bg-blue-100 text-blue-700',
  },
  [OrderType.DELIVERY]: {
    label: 'Delivery',
    color: 'bg-purple-100 text-purple-700',
  },
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CREDIT_CARD]: 'T. Crédito',
  [PaymentMethod.DEBIT_CARD]: 'T. Débito',
  [PaymentMethod.YAPE]: 'Yape',
  [PaymentMethod.PLIN]: 'Plin',
  [PaymentMethod.DIGITAL_WALLET]: 'Billetera',
};

const fmt = (date: string) =>
  new Date(date).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function OrdersTable({
  orders,
  loading,
  onView,
  onPreCheck,
}: OrdersTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-800 rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <FileText size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">Sin órdenes</p>
        <p className="text-xs text-gray-400 mt-1">Prueba con otros filtros</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {[
              '# Orden',
              'Cliente',
              'Tipo',
              'Estado',
              'Total',
              'Pago',
              'Fecha',
              '',
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const type = orderTypeConfig[order.orderType];
            return (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* ID / Invoice */}
                <td className="px-4 py-3">
                  <p className="font-black text-gray-900 text-xs">
                    #{order.id}
                  </p>
                  {order.invoiceNumber && (
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {order.invoiceNumber}
                    </p>
                  )}
                </td>

                {/* Cliente */}
                <td className="px-4 py-3">
                  {order.client ? (
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">
                        {order.client.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {order.client.phoneNumber}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>

                {/* Tipo */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${type.color}`}
                  >
                    {type.label}
                  </span>
                  {order.orderType === OrderType.DINE_IN && order.table && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Mesa {order.table.number}
                    </p>
                  )}
                  {order.orderType === OrderType.DELIVERY &&
                    order.deliveryDriver && (
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[100px]">
                        {order.deliveryDriver.name}
                      </p>
                    )}
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${status.bg} ${status.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </span>
                </td>

                {/* Total */}
                <td className="px-4 py-3">
                  <p className="font-black text-gray-900 text-sm">
                    S/ {order.total.toFixed(2)}
                  </p>
                  {order.subtotal !== order.total && (
                    <p className="text-[10px] text-gray-400">
                      Sub: S/ {order.subtotal.toFixed(2)}
                    </p>
                  )}
                </td>

                {/* Pago */}
                <td className="px-4 py-3">
                  {order.payment ? (
                    <span className="text-xs text-gray-600 font-semibold">
                      {paymentMethodLabel[order.payment.paymentMethod]}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                      Pendiente
                    </span>
                  )}
                </td>

                {/* Fecha */}
                <td className="px-4 py-3 text-xs text-gray-400">
                  {fmt(order.createdAt)}
                </td>

                {/* Acciones */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => onView(order)}
                      title="Ver detalle"
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-700 transition-all"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => onPreCheck(order)}
                      title="Pre-cuenta"
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-800 transition-all"
                    >
                      <FileText size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
