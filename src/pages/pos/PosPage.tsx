import {
  MapPin,
  RefreshCw,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWebSocket } from '../../config/websocket';
import {
  OrderResponse,
  OrderStatus,
  OrderType,
} from '../../actions/orders/orders.interface';
import OrderCard, { statusConfig } from '../../components/pos/OrderCard';
import PosOrderDetailModal from '../../components/pos/PosOrderDetailModal';
import { getPosOrders } from '../../actions/orders/get-pos-orders';

// Active statuses to show in the POS (completed/cancelled are in history)
const ACTIVE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.SERVED,
];

const STATUS_COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: OrderStatus.PENDING, label: 'Pendientes' },
  { status: OrderStatus.PREPARING, label: 'En preparación' },
  { status: OrderStatus.READY, label: 'Listos' },
  { status: OrderStatus.OUT_FOR_DELIVERY, label: 'En camino' },
  { status: OrderStatus.DELIVERED, label: 'Entregados' },
  { status: OrderStatus.SERVED, label: 'Servidos' },
];

const newOrderButtons = [
  {
    label: 'Salón',
    path: '/pedidos/salon',
    icon: <UtensilsCrossed size={18} />,
    color: 'bg-emerald-600 hover:bg-emerald-700',
  },
  {
    label: 'Para llevar',
    path: '/pedidos/para-llevar',
    icon: <ShoppingBag size={18} />,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    label: 'Delivery',
    path: '/pedidos/delivery',
    icon: <Truck size={18} />,
    color: 'bg-purple-600 hover:bg-purple-700',
  },
];

const typeFilter = [
  { value: 'ALL' as const, label: 'Todos' },
  { value: OrderType.DINE_IN, label: 'Salón' },
  { value: OrderType.TAKEAWAY, label: 'Para llevar' },
  { value: OrderType.DELIVERY, label: 'Delivery' },
];

export default function PosPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [selectedType, setSelectedType] = useState<OrderType | 'ALL'>('ALL');
  const [viewingOrder, setViewingOrder] = useState<OrderResponse | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval>>(
    {} as ReturnType<typeof setInterval>,
  );

  async function loadPosOrders() {
    const response = await getPosOrders();
    setOrders(response);
  }

  // ── WebSocket ──────────────────────────────────────────────────────────────
  useEffect(() => {
    loadPosOrders();

    connectWebSocket((client) => {
      setWsConnected(true);

      // New order
      client.subscribe('/topic/orders/new', (msg) => {
        const newOrder: OrderResponse = JSON.parse(msg.body);
        setOrders((prev) => [newOrder, ...prev]);
        setLastUpdated(new Date());
      });

      // Order updated (if your backend publishes status changes)
      client.subscribe('/topic/orders/updated', (msg) => {
        const updated: OrderResponse = JSON.parse(msg.body);
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o)),
        );
        setLastUpdated(new Date());
      });
    });

    return () => {
      setWsConnected(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  const filteredOrders =
    selectedType === 'ALL'
      ? activeOrders
      : activeOrders.filter((o) => o.orderType === selectedType);

  const getColumnOrders = (status: OrderStatus) =>
    filteredOrders.filter((o) => o.status === status);

  const handleOrderUpdated = () => {
    // In a real app you'd re-fetch or rely on WS; here we just refresh timestamp
    setLastUpdated(new Date());
    setViewingOrder(null);
  };

  const totalActive = activeOrders.length;
  const pendingCount = activeOrders.filter(
    (o) => o.status === OrderStatus.PENDING,
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ── Top bar ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center">
              <MapPin size={20} className="text-white" />
            </div>
            <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-red-800 rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
              POS · <span className="text-red-800">Órdenes</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              {totalActive} activas ·{' '}
              {pendingCount > 0 && (
                <span className="text-red-600 font-bold">
                  {pendingCount} pendientes
                </span>
              )}
            </p>
          </div>
        </div>

        {/* New order buttons */}
        <div className="flex items-center gap-2">
          {newOrderButtons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wide transition-all shadow-sm ${btn.color}`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* WS status + time */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className={`flex items-center gap-1.5 text-[11px] font-bold ${wsConnected ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            {wsConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
            {wsConnected ? 'En vivo' : 'Desconectado'}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <RefreshCw size={10} />
            {lastUpdated.toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
      </header>

      {/* ── Type filter tabs ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center gap-1">
        {typeFilter.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedType(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedType === f.value
                ? 'bg-red-800 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {f.label}
            <span
              className={`ml-1.5 text-[10px] font-black rounded-full px-1.5 py-0.5 ${
                selectedType === f.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {f.value === 'ALL'
                ? activeOrders.length
                : activeOrders.filter((o) => o.orderType === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Kanban columns ── */}
      <div className="flex-1 overflow-x-auto px-4 py-4">
        <div className="flex gap-3 h-full min-w-max">
          {STATUS_COLUMNS.map(({ status, label }) => {
            const columnOrders = getColumnOrders(status);
            const cfg = statusConfig[status];
            return (
              <div
                key={status}
                className="w-[260px] flex-shrink-0 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                {/* Column header */}
                <div className={`px-4 py-3 border-b border-gray-100 ${cfg.bg}`}>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black uppercase tracking-wider ${cfg.text}`}
                    >
                      {label}
                    </span>
                    <span
                      className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                        columnOrders.length > 0
                          ? `${cfg.bg} ${cfg.text} border ${cfg.border}`
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {columnOrders.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {columnOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-300">
                      <span className="text-xs font-semibold">Sin órdenes</span>
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={setViewingOrder}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail modal ── */}
      {viewingOrder && (
        <PosOrderDetailModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
