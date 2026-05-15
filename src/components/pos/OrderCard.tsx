import { Clock, MapPin, Truck, UtensilsCrossed } from 'lucide-react';
import {
  OrderResponse,
  OrderStatus,
  OrderType,
} from '../../actions/orders/orders.interface';

interface OrderCardProps {
  order: OrderResponse;
  onClick: (order: OrderResponse) => void;
}

export const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  [OrderStatus.PENDING]: {
    label: 'Pendiente',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    dot: 'bg-yellow-500',
  },
  [OrderStatus.PREPARING]: {
    label: 'Preparando',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  },
  [OrderStatus.READY]: {
    label: 'Listo',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-400',
    dot: 'bg-emerald-500',
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    label: 'En camino',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-300',
    dot: 'bg-purple-500',
  },
  [OrderStatus.DELIVERED]: {
    label: 'Entregado',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-300',
    dot: 'bg-teal-500',
  },
  [OrderStatus.SERVED]: {
    label: 'Servido',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
    dot: 'bg-indigo-500',
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completado',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelado',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
};

const typeIcon: Record<OrderType, React.ReactNode> = {
  [OrderType.DINE_IN]: <UtensilsCrossed size={13} />,
  [OrderType.TAKEAWAY]: <MapPin size={13} />,
  [OrderType.DELIVERY]: <Truck size={13} />,
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

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

const isActive = (status: OrderStatus) =>
  ![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(status);

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const cfg = statusConfig[order.status];
  const active = isActive(order.status);

  return (
    <button
      onClick={() => onClick(order)}
      className={`w-full text-left bg-white rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group ${
        active ? `${cfg.border} hover:shadow-lg` : 'border-gray-200 opacity-70'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-black text-gray-900 text-base">
            #{order.id}
          </span>
          {order.table && (
            <span className="flex items-center gap-1 text-[11px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-lg">
              Mesa {order.table.number}
            </span>
          )}
        </div>
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${active && order.status === OrderStatus.PREPARING ? 'animate-pulse' : ''}`}
          />
          {cfg.label}
        </span>
      </div>

      {/* Client */}
      <p className="text-sm font-semibold text-gray-900 truncate mb-1">
        {order.client?.name ?? (
          <span className="text-gray-400 font-normal">Sin cliente</span>
        )}
      </p>

      {/* Delivery driver */}
      {order.deliveryDriver && (
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-1 truncate">
          <Truck size={11} className="text-purple-500 flex-shrink-0" />
          {order.deliveryDriver.name}
        </p>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <span
          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${typeColor[order.orderType]}`}
        >
          {typeIcon[order.orderType]}
          {typeLabel[order.orderType]}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-red-800">
            S/ {order.total.toFixed(2)}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
            <Clock size={10} />
            {timeAgo(order.createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
}
