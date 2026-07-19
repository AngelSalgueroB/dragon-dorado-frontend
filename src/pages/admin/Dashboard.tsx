import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  ChefHat,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  Filter,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Truck,
  Utensils,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import {
  DashboardDataResponse,
  DashboardOrderStatusResponse,
  DashboardOrderTypeResponse,
  DashboardPaymentMethodResponse,
  DashboardSalesTrendResponse,
  DashboardTopProductResponse,
  DashboardTrendGroupBy,
} from '../../actions/dashboard/dashboard.interfaces';
import {
  OrderResponse,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../../actions/orders/orders.interface';
import { getDashboardData } from '../../actions/dashboard/get-dashboard-data';
import { exportDashboardToExcel } from '../../utils/export-dashboard-excel';

const money = (value?: number) => `S/ ${(Number(value) || 0).toFixed(2)}`;

const numberText = (value?: number) => `${Number(value) || 0}`;

const toInputDateTime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toApiDateTime = (value: string) => {
  if (!value) return undefined;
  return value.length === 16 ? `${value}:00` : value;
};

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    startDate: toInputDateTime(start),
    endDate: toInputDateTime(end),
  };
};

const getLastDaysRange = (days: number) => {
  const end = new Date();
  end.setHours(23, 59, 0, 0);

  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  return {
    startDate: toInputDateTime(start),
    endDate: toInputDateTime(end),
  };
};

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

const orderTypeIcon: Record<OrderType, ReactNode> = {
  [OrderType.DINE_IN]: <Utensils size={16} />,
  [OrderType.TAKEAWAY]: <ShoppingBag size={16} />,
  [OrderType.DELIVERY]: <Truck size={16} />,
};

const statusColor: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-100',
  [OrderStatus.PREPARING]: 'bg-orange-50 text-orange-700 border-orange-100',
  [OrderStatus.READY]: 'bg-blue-50 text-blue-700 border-blue-100',
  [OrderStatus.OUT_FOR_DELIVERY]: 'bg-purple-50 text-purple-700 border-purple-100',
  [OrderStatus.DELIVERED]: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  [OrderStatus.SERVED]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  [OrderStatus.COMPLETED]: 'bg-green-50 text-green-700 border-green-100',
  [OrderStatus.CANCELLED]: 'bg-red-50 text-red-700 border-red-100',
};

function sumOrdersByStatus(
  data: DashboardOrderStatusResponse[],
  statuses: OrderStatus[],
) {
  return data
    .filter((item) => statuses.includes(item.status))
    .reduce((sum, item) => sum + Number(item.orderCount || 0), 0);
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${tone} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">
            {title}
          </p>
          <p className="text-3xl font-black text-gray-900 tracking-tight mt-2">
            {value}
          </p>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            {subtitle}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span className="text-red-800">{icon}</span>
            {title}
          </h2>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="h-36 flex flex-col items-center justify-center text-gray-300 gap-2">
      <BarChart3 size={30} />
      <p className="text-xs font-bold text-gray-400">{label}</p>
    </div>
  );
}

function HorizontalBars({
  items,
  labelGetter,
  valueGetter,
  totalGetter,
}: {
  items: Array<DashboardOrderStatusResponse | DashboardOrderTypeResponse | DashboardPaymentMethodResponse | DashboardTopProductResponse>;
  labelGetter: (item: any) => string;
  valueGetter: (item: any) => number;
  totalGetter: (item: any) => number;
}) {
  if (items.length === 0) return <EmptyState label="Sin datos para este filtro" />;

  const max = Math.max(...items.map(valueGetter), 1);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const value = valueGetter(item);
        const width = Math.max((value / max) * 100, 4);

        return (
          <div key={`${labelGetter(item)}-${index}`}>
            <div className="flex justify-between items-center gap-3 mb-1">
              <span className="text-xs font-bold text-gray-700 truncate">
                {labelGetter(item)}
              </span>
              <span className="text-xs font-black text-gray-900 whitespace-nowrap">
                {value} · {money(totalGetter(item))}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-800"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrendBars({ items }: { items: DashboardSalesTrendResponse[] }) {
  if (items.length === 0) return <EmptyState label="Sin ventas completadas" />;

  const max = Math.max(...items.map((item) => Number(item.total || 0)), 1);

  return (
    <div className="h-56 flex items-end gap-2 overflow-x-auto pb-1">
      {items.map((item) => {
        const height = Math.max((Number(item.total || 0) / max) * 100, 8);

        return (
          <div
            key={item.period}
            className="min-w-[56px] flex-1 flex flex-col items-center gap-2"
            title={`${item.period} · ${money(item.total)} · ${item.orderCount} órdenes`}
          >
            <div className="w-full h-44 flex items-end justify-center bg-gray-50 rounded-xl border border-gray-100 px-2">
              <div
                className="w-full rounded-t-lg bg-red-800"
                style={{ height: `${height}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-gray-400 text-center leading-tight line-clamp-2">
              {item.period}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function RecentOrdersTable({ orders }: { orders: OrderResponse[] }) {
  if (orders.length === 0) return <EmptyState label="Sin órdenes recientes" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['Orden', 'Tipo', 'Estado', 'Total', 'Fecha'].map((header) => (
              <th
                key={header}
                className="px-3 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-3 font-mono text-xs font-bold text-gray-700">
                #{order.id}
              </td>
              <td className="px-3 py-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600">
                  {orderTypeIcon[order.orderType]}
                  {orderTypeLabel[order.orderType]}
                </span>
              </td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-black ${statusColor[order.status]}`}
                >
                  {orderStatusLabel[order.status]}
                </span>
              </td>
              <td className="px-3 py-3 text-xs font-black text-gray-900">
                {money(order.total)}
              </td>
              <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">
                {new Date(order.createdAt).toLocaleString('es-PE', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const initialRange = useMemo(() => getTodayRange(), []);
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [orderType, setOrderType] = useState<OrderType | ''>('');
  const [trendGroupBy, setTrendGroupBy] = useState<DashboardTrendGroupBy>('day');

  const [dashboardData, setDashboardData] = useState<DashboardDataResponse>();
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData({
        startDate: toApiDateTime(startDate),
        endDate: toApiDateTime(endDate),
        orderType: orderType || undefined,
        trendGroupBy,
      });
      setDashboardData(response);
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summary = dashboardData?.summary;
  const ordersByStatus = dashboardData?.ordersByStatus ?? [];
  const salesByOrderType = dashboardData?.salesByOrderType ?? [];
  const salesByPaymentMethod = dashboardData?.salesByPaymentMethod ?? [];
  const topProducts = dashboardData?.topProducts ?? [];
  const salesTrend = dashboardData?.salesTrend ?? [];
  const recentOrders = dashboardData?.recentOrders ?? [];

  const totalVentas = summary
    ? Number(summary.dineInTotal || 0) +
      Number(summary.takeawayTotal || 0) +
      Number(summary.deliveryTotal || 0)
    : 0;

  const totalOrders = summary
    ? Number(summary.dineInCount || 0) +
      Number(summary.takeawayCount || 0) +
      Number(summary.deliveryCount || 0)
    : 0;

  const pendingOrders = sumOrdersByStatus(ordersByStatus, [
    OrderStatus.PENDING,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.OUT_FOR_DELIVERY,
  ]);

  const cancelledOrders = sumOrdersByStatus(ordersByStatus, [
    OrderStatus.CANCELLED,
  ]);

  const avgTicket = totalOrders > 0 ? totalVentas / totalOrders : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const applyQuickRange = (type: 'today' | '7d' | '30d') => {
    const range = type === 'today' ? getTodayRange() : getLastDaysRange(type === '7d' ? 7 : 30);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  const handleExportExcel = () => {
    if (!dashboardData) return;
    exportDashboardToExcel(dashboardData, {
      startDate,
      endDate,
      orderType,
      trendGroupBy,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800 font-sans">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-6 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-red-800" />
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
            Panel de <span className="text-red-800">Control</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
            Métricas de ventas, órdenes, pagos y productos
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyQuickRange('today')}
            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-black text-gray-600 hover:border-red-800 hover:text-red-800 transition-all"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => applyQuickRange('7d')}
            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-black text-gray-600 hover:border-red-800 hover:text-red-800 transition-all"
          >
            7 días
          </button>
          <button
            type="button"
            onClick={() => applyQuickRange('30d')}
            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-black text-gray-600 hover:border-red-800 hover:text-red-800 transition-all"
          >
            30 días
          </button>
          <button
            onClick={handleLogout}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-red-800 hover:text-white hover:border-red-800 px-5 py-2 rounded-lg font-bold text-xs transition-all uppercase shadow-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={15} className="text-red-800" />
          <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-500">
            Filtros del dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          <label className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <CalendarDays size={11} /> Desde
            </span>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            />
          </label>

          <label className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <CalendarDays size={11} /> Hasta
            </span>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            />
          </label>

          <label className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Tipo de orden
            </span>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as OrderType | '')}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            >
              <option value="">Todos</option>
              {Object.values(OrderType).map((type) => (
                <option key={type} value={type}>
                  {orderTypeLabel[type]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Tendencia
            </span>
            <select
              value={trendGroupBy}
              onChange={(e) =>
                setTrendGroupBy(e.target.value as DashboardTrendGroupBy)
              }
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            >
              <option value="hour">Por hora</option>
              <option value="day">Por día</option>
              <option value="month">Por mes</option>
            </select>
          </label>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="self-end px-4 py-2 rounded-xl bg-red-800 text-white text-xs font-black uppercase tracking-wide hover:bg-red-900 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Cargando' : 'Aplicar'}
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!dashboardData || loading}
            className="self-end px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-wide hover:border-emerald-600 hover:text-emerald-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Excel
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <KpiCard
          title="Ventas"
          value={loading ? '...' : money(totalVentas)}
          subtitle="Órdenes completadas"
          icon={<TrendingUp size={20} />}
          tone="border-yellow-500"
        />
        <KpiCard
          title="Órdenes"
          value={loading ? '...' : numberText(totalOrders)}
          subtitle="Salón, delivery y para llevar"
          icon={<PackageCheck size={20} />}
          tone="border-emerald-500"
        />
        <KpiCard
          title="Ticket promedio"
          value={loading ? '...' : money(avgTicket)}
          subtitle="Ventas / órdenes completadas"
          icon={<CircleDollarSign size={20} />}
          tone="border-blue-500"
        />
        <KpiCard
          title="Pendientes"
          value={loading ? '...' : numberText(pendingOrders)}
          subtitle={`${cancelledOrders} canceladas en el rango`}
          icon={<AlertCircle size={20} />}
          tone="border-red-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <SectionCard
            title="Tendencia de ventas"
            subtitle="Usa el filtro para agrupar por hora, día o mes"
            icon={<BarChart3 size={16} />}
          >
            <TrendBars items={salesTrend} />
          </SectionCard>
        </div>

        <SectionCard
          title="Estados de órdenes"
          subtitle="Conteo y total por estado"
          icon={<Clock3 size={16} />}
        >
          <HorizontalBars
            items={ordersByStatus}
            labelGetter={(item: DashboardOrderStatusResponse) =>
              orderStatusLabel[item.status] ?? item.status
            }
            valueGetter={(item: DashboardOrderStatusResponse) =>
              Number(item.orderCount || 0)
            }
            totalGetter={(item: DashboardOrderStatusResponse) =>
              Number(item.total || 0)
            }
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <SectionCard
          title="Ventas por tipo"
          subtitle="Salón, delivery y para llevar"
          icon={<Utensils size={16} />}
        >
          <HorizontalBars
            items={salesByOrderType}
            labelGetter={(item: DashboardOrderTypeResponse) =>
              orderTypeLabel[item.orderType] ?? item.orderType
            }
            valueGetter={(item: DashboardOrderTypeResponse) =>
              Number(item.orderCount || 0)
            }
            totalGetter={(item: DashboardOrderTypeResponse) =>
              Number(item.total || 0)
            }
          />
        </SectionCard>

        <SectionCard
          title="Métodos de pago"
          subtitle="Ventas completadas por pago"
          icon={<CreditCard size={16} />}
        >
          <HorizontalBars
            items={salesByPaymentMethod}
            labelGetter={(item: DashboardPaymentMethodResponse) =>
              paymentMethodLabel[item.paymentMethod] ?? item.paymentMethod
            }
            valueGetter={(item: DashboardPaymentMethodResponse) =>
              Number(item.paymentCount || 0)
            }
            totalGetter={(item: DashboardPaymentMethodResponse) =>
              Number(item.total || 0)
            }
          />
        </SectionCard>

        <SectionCard
          title="Productos top"
          subtitle="Más vendidos por cantidad"
          icon={<ChefHat size={16} />}
        >
          <HorizontalBars
            items={topProducts}
            labelGetter={(item: DashboardTopProductResponse) =>
              item.productName
            }
            valueGetter={(item: DashboardTopProductResponse) =>
              Number(item.quantitySold || 0)
            }
            totalGetter={(item: DashboardTopProductResponse) =>
              Number(item.total || 0)
            }
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Órdenes recientes"
        subtitle="Últimas órdenes del rango seleccionado"
        icon={<PackageCheck size={16} />}
      >
        <RecentOrdersTable orders={recentOrders} />
      </SectionCard>
    </div>
  );
}
