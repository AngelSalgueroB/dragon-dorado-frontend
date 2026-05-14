import { FileText, Loader2, MapPin, Phone, Truck, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  orderTypeConfig,
  paymentMethodLabel,
  statusConfig,
} from './OrdersTable';
import {
  OrderFullResponse,
  OrderResponse,
} from '../../actions/orders/orders.interface';
import { getOrderById } from '../../actions/orders/get-order-by-id';
import { getOrderPreCheck } from '../../actions/orders/generate-pre-check';

interface OrderDetailModalProps {
  order: OrderResponse;
  onClose: () => void;
}

const fmt = (date: string) =>
  new Date(date).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function OrderDetailModal({
  order,
  onClose,
}: OrderDetailModalProps) {
  const [detail, setDetail] = useState<OrderFullResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [loadingPreCheck, setLoadingPreCheck] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getOrderById(order.id);
        setDetail(data);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetch();
  }, [order.id]);

  const handlePreCheck = async () => {
    setLoadingPreCheck(true);
    try {
      const blob = await getOrderPreCheck(order.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pre-cuenta-orden-${order.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingPreCheck(false);
    }
  };

  const status = statusConfig[order.status];
  const type = orderTypeConfig[order.orderType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">
                Orden #{order.id}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${status.bg} ${status.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${type.color}`}
              >
                {type.label}
              </span>
            </div>
            {order.invoiceNumber && (
              <p className="text-xs text-gray-400 font-mono">
                {order.invoiceNumber}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              {fmt(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreCheck}
              disabled={loadingPreCheck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-800 hover:border-red-200 transition-all disabled:opacity-50"
            >
              {loadingPreCheck ? (
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

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cliente */}
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
                {order.client.email && (
                  <p className="text-xs text-gray-400">{order.client.email}</p>
                )}
              </div>
            )}

            {/* Mesa */}
            {order.table && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Mesa
                </p>
                <p className="text-sm font-bold text-gray-900">
                  Mesa #{order.table.number}
                </p>
                {order.table.name && (
                  <p className="text-xs text-gray-500">{order.table.name}</p>
                )}
                <p className="text-xs text-gray-400">
                  {order.table.capacity} personas
                </p>
              </div>
            )}

            {/* Delivery driver */}
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

            {/* Delivery address */}
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

            {/* Pago */}
            {order.payment && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Pago
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {paymentMethodLabel[order.payment.paymentMethod]}
                </p>
                <p className="text-sm font-black text-emerald-600">
                  S/ {order.payment.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {fmt(order.payment.transactionDate)}
                </p>
              </div>
            )}

            {/* Notas */}
            {order.details && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
                  Notas
                </p>
                <p className="text-xs text-amber-800">{order.details}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-800 rounded-full" />
              Productos
            </p>

            {loadingDetail ? (
              <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Cargando items...</span>
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
                        P. Unit.
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
                            <p className="text-[10px] text-gray-400">
                              {item.details}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center text-xs font-bold text-gray-700">
                          ×{item.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs font-mono text-gray-600">
                          S/ {item.unitPrice.toFixed(2)}
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
        </div>

        {/* Footer totals */}
        <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-8">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-semibold">Subtotal</p>
              <p className="text-sm font-mono text-gray-700">
                S/ {order.subtotal.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-semibold">Total</p>
              <p className="text-xl font-black text-red-800 font-mono">
                S/ {order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
