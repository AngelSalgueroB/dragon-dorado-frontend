import {
  AlertTriangle,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Truck,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { statusConfig } from './OrderCard';
import {
  OrderFullResponse,
  OrderResponse,
  OrderStatus,
  OrderType,
} from '../../actions/orders/orders.interface';
import { getOrderById } from '../../actions/orders/get-order-by-id';
import { getOrderPreCheck } from '../../actions/orders/generate-pre-check';
import { Client } from '@stomp/stompjs';
import { cancelOrder, updateOrder } from '../../actions/orders/update-order';
import { PaymentMethod } from '../../actions/orders/orders.interface';
import { toast } from 'react-toastify';

interface PosOrderDetailModalProps {
  order: OrderResponse;
  wsClient: Client | null;
  onClose: () => void;
  onUpdated: () => void;
}

// Status transitions per type
function getNextStatuses(
  currentStatus: OrderStatus,
  orderType: OrderType,
): OrderStatus[] {
  if (currentStatus === OrderStatus.PENDING) {
    return [OrderStatus.PREPARING];
  }

  if (currentStatus === OrderStatus.PREPARING) {
    return [OrderStatus.READY];
  }

  if (currentStatus === OrderStatus.READY) {
    return orderType === OrderType.DELIVERY
      ? [OrderStatus.OUT_FOR_DELIVERY]
      : [OrderStatus.SERVED];
  }

  if (currentStatus === OrderStatus.OUT_FOR_DELIVERY) {
    return [OrderStatus.DELIVERED];
  }

  if (
    currentStatus === OrderStatus.DELIVERED ||
    currentStatus === OrderStatus.SERVED
  ) {
    return [OrderStatus.COMPLETED];
  }

  return [];
}

const nextStatusLabel: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.PENDING]: 'Marcar como Preparando',
  [OrderStatus.PREPARING]: 'Marcar como Listo',
  [OrderStatus.READY]: 'Marcar como Servido / En camino',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Marcar como Entregado',
  [OrderStatus.DELIVERED]: 'Completar orden',
  [OrderStatus.SERVED]: 'Completar orden',
};

const typeLabel: Record<OrderType, string> = {
  [OrderType.DINE_IN]: 'Salón',
  [OrderType.TAKEAWAY]: 'Para llevar',
  [OrderType.DELIVERY]: 'Delivery',
};

const typeColor: Record<OrderType, string> = {
  [OrderType.DINE_IN]: 'bg-emerald-100 text-emerald-700',
  [OrderType.TAKEAWAY]: 'bg-blue-100 text-blue-700',
  [OrderType.DELIVERY]: 'bg-purple-100 text-purple-700',
};

const paymentMethodLabel: Record<string, string> = {
  CASH: 'Efectivo',
  CREDIT_CARD: 'T. Crédito',
  DEBIT_CARD: 'T. Débito',
  YAPE: 'Yape',
  PLIN: 'Plin',
  DIGITAL_WALLET: 'Billetera',
};

const fmt = (d: string) =>
  new Date(d).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const canCancel = (s: OrderStatus) =>
  [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY].includes(s);

export default function PosOrderDetailModal({
  order,
  onClose,
  onUpdated,
  wsClient,
}: PosOrderDetailModalProps) {
  const [detail, setDetail] = useState<OrderFullResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<OrderStatus | null>(
    null,
  );
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [paymentDetails, setPaymentDetails] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const d = await getOrderById(order.id);
        setDetail(d);
        setCurrentStatus(d.status);
      } finally {
        setLoadingDetail(false);
      }
    })();
  }, [order.id]);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    setUpdatingStatus(newStatus);

    try {
      updateOrder(wsClient, {
        orderId: order.id,
        status: newStatus,
        details: detail?.details ?? order.details ?? undefined,
        paymentMethod:
          newStatus === OrderStatus.COMPLETED ? paymentMethod : undefined,
        paymentDetails:
          newStatus === OrderStatus.COMPLETED
            ? paymentDetails || undefined
            : undefined,
      });

      toast.info(`Actualización enviada para la orden #${order.id}`);
      onUpdated();
    } catch {
      toast.error('No se pudo enviar la actualización por WebSocket.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCancel = () => {
    setUpdatingStatus(OrderStatus.CANCELLED);

    try {
      cancelOrder(
        wsClient,
        order.id,
        detail?.details ?? order.details ?? undefined,
      );

      toast.info(`Cancelación enviada para la orden #${order.id}`);
      setShowCancelConfirm(false);
      onUpdated();
    } catch {
      toast.error('No se pudo enviar la cancelación por WebSocket.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePreCheck = async () => {
    setLoadingPdf(true);
    try {
      const blob = await getOrderPreCheck(order.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pre-cuenta-${order.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingPdf(false);
    }
  };

  const cfg = statusConfig[currentStatus];
  const nextStatuses = getNextStatuses(currentStatus, order.orderType);
  const isFinal = [OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(
    currentStatus,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-black text-gray-900 text-xl">
              Orden #{order.id}
            </h2>
            {order.table && (
              <span className="font-black text-sm bg-gray-900 text-white px-3 py-1 rounded-xl">
                Mesa {order.table.number}
                {order.table.name && ` · ${order.table.name}`}
              </span>
            )}
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${cfg.bg} ${cfg.text}`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${typeColor[order.orderType]}`}
            >
              {typeLabel[order.orderType]}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handlePreCheck}
              disabled={loadingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-800 hover:border-red-200 transition-all disabled:opacity-50"
            >
              {loadingPdf ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <FileText size={13} />
              )}
              Pre-cuenta
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {order.client && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <User size={10} /> Cliente
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {order.client.name}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {order.client.phoneNumber}
                </p>
              </div>
            )}

            {order.table && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Mesa
                </p>
                <p className="text-2xl font-black text-gray-900">
                  #{order.table.number}
                </p>
                <p className="text-xs text-gray-500">
                  {order.table.capacity} personas
                </p>
              </div>
            )}

            {order.deliveryDriver && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Truck size={10} /> Conductor
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {order.deliveryDriver.name}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {order.deliveryDriver.phoneNumber}
                </p>
                <p className="text-xs text-gray-400">
                  {order.deliveryDriver.platform}
                </p>
              </div>
            )}

            {order.deliveryAddress && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin size={10} /> Dirección
                </p>
                <p className="text-xs font-bold text-gray-900">
                  {order.deliveryAddress.addressLine}
                </p>
                {order.deliveryAddress.reference && (
                  <p className="text-xs text-gray-500">
                    {order.deliveryAddress.reference}
                  </p>
                )}
                <p className="text-xs text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                  <Phone size={10} /> {order.deliveryAddress.phoneNumber}
                </p>
              </div>
            )}

            {order.payment && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Pago
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {paymentMethodLabel[order.payment.paymentMethod]}
                </p>
                <p className="text-base font-black text-emerald-600">
                  S/ {order.payment.total.toFixed(2)}
                </p>
              </div>
            )}

            {order.details && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
                  Notas
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {order.details}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-800 rounded-full" /> Productos
            </p>
            {loadingDetail ? (
              <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Cargando productos...</span>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-4 py-2 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Cant.
                      </th>
                      <th className="px-4 py-2 text-right text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail?.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-4 py-2.5">
                          <p className="font-semibold text-gray-900 text-xs">
                            {item.productName}
                          </p>
                          {item.details && (
                            <p className="text-[10px] text-gray-400 italic">
                              {item.details}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="inline-flex w-6 h-6 rounded-full bg-gray-100 items-center justify-center text-xs font-black text-gray-700">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs font-black font-mono text-gray-900">
                          S/ {item.subTotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Dates */}
          <p className="text-[10px] text-gray-400">
            Creado: {fmt(order.createdAt)} · Actualizado: {fmt(order.updatedAt)}
          </p>
        </div>

        {/* ── Footer: totals + actions ── */}
        <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-gray-50 rounded-b-2xl space-y-3">
          {/* Totals */}
          <div className="flex justify-end gap-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Subtotal
              </p>
              <p className="text-sm font-mono text-gray-700">
                S/ {order.subtotal.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Total
              </p>
              <p className="text-2xl font-black text-red-800 font-mono">
                S/ {order.total.toFixed(2)}
              </p>
            </div>
          </div>

          {nextStatuses.includes(OrderStatus.COMPLETED) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Método de pago
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as PaymentMethod)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
                >
                  {Object.values(PaymentMethod).map((method) => (
                    <option key={method} value={method}>
                      {paymentMethodLabel[method]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Detalle de pago
                </label>

                <input
                  type="text"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="Ej. operación Yape, vuelto, referencia..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
                />
              </div>
            </div>
          )}

          {/* Status actions */}
          {!isFinal && (
            <div className="flex items-center gap-3">
              {/* Cancel button */}
              {canCancel(currentStatus) && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-600 text-xs font-black uppercase tracking-wide hover:bg-red-50 transition-all"
                >
                  <X size={14} />
                  Cancelar orden
                </button>
              )}

              {/* Next status buttons */}
              <div className="flex gap-2 flex-1 flex-wrap">
                {nextStatuses.map((nextStatus) => {
                  const nextCfg = statusConfig[nextStatus];
                  const isLoading = updatingStatus === nextStatus;
                  return (
                    <button
                      key={nextStatus}
                      onClick={() => handleUpdateStatus(nextStatus)}
                      disabled={!!updatingStatus}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wide disabled:opacity-60 transition-all ${
                        nextStatus === OrderStatus.COMPLETED
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-gray-900 hover:bg-gray-700'
                      }`}
                    >
                      {isLoading && (
                        <Loader2 size={13} className="animate-spin" />
                      )}
                      <span className={`w-2 h-2 rounded-full ${nextCfg.dot}`} />
                      {nextStatusLabel[currentStatus] ?? `→ ${nextCfg.label}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isFinal && (
            <p
              className={`text-center text-xs font-bold py-1.5 rounded-xl ${cfg.bg} ${cfg.text}`}
            >
              Orden {cfg.label.toLowerCase()} · Sin acciones disponibles
            </p>
          )}
        </div>
      </div>

      {/* ── Cancel confirm overlay ── */}
      {showCancelConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-600" />
            </div>
            <h3 className="font-black text-gray-900 text-base uppercase mb-1">
              ¿Cancelar orden?
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              Orden{' '}
              <span className="font-black text-gray-800">#{order.id}</span>
            </p>
            {order.client && (
              <p className="text-xs text-gray-400 mb-5">{order.client.name}</p>
            )}
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-5">
              Esta acción no puede deshacerse.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Volver
              </button>
              <button
                onClick={handleCancel}
                disabled={!!updatingStatus}
                className="flex-1 py-2.5 rounded-xl bg-red-800 text-white text-sm font-black uppercase tracking-wide hover:bg-red-900 disabled:opacity-60 transition-all"
              >
                {updatingStatus ? (
                  <Loader2 size={14} className="animate-spin mx-auto" />
                ) : (
                  'Sí, cancelar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
