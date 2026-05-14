import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Loader2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ChangeEvent, SubmitEvent, useEffect, useState } from 'react';
import { DeliveryPlatform } from '../../actions/delivery-drivers/delivery-drivers.interface';
import {
  GetOrdersParams,
  OrderResponse,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../../actions/orders/orders.interface';
import { PageResponse } from '../../actions/common';
import { getOrders } from '../../actions/orders/get-orders';
import { getOrderPreCheck } from '../../actions/orders/generate-pre-check';
import OrdersTable from '../../components/orders/OrdersTable';
import OrderDetailModal from '../../components/orders/OrderDetailModal';

const PAGE_SIZE = 15;

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400 bg-white';
const labelClass =
  'block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1';

interface Filters {
  status: OrderStatus | '';
  orderType: OrderType | '';
  clientName: string;
  clientPhoneNumber: string;
  invoiceNumber: string;
  minTotal: string;
  maxTotal: string;
  minDate: string;
  maxDate: string;
  tableNumber: string;
  paymentMethod: PaymentMethod | '';
  deliveryDriverName: string;
  deliveryDriverPlatform: DeliveryPlatform | '';
}

const defaultFilters: Filters = {
  status: '',
  orderType: '',
  clientName: '',
  clientPhoneNumber: '',
  invoiceNumber: '',
  minTotal: '',
  maxTotal: '',
  minDate: '',
  maxDate: '',
  tableNumber: '',
  paymentMethod: '',
  deliveryDriverName: '',
  deliveryDriverPlatform: '',
};

const statusOptions: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: OrderStatus.PENDING, label: 'Pendiente' },
  { value: OrderStatus.PREPARING, label: 'Preparando' },
  { value: OrderStatus.READY, label: 'Listo' },
  { value: OrderStatus.OUT_FOR_DELIVERY, label: 'En camino' },
  { value: OrderStatus.DELIVERED, label: 'Entregado' },
  { value: OrderStatus.SERVED, label: 'Servido' },
  { value: OrderStatus.COMPLETED, label: 'Completado' },
  { value: OrderStatus.CANCELLED, label: 'Cancelado' },
];

const orderTypeOptions: { value: OrderType | ''; label: string }[] = [
  { value: '', label: 'Todos los tipos' },
  { value: OrderType.DINE_IN, label: 'Salón' },
  { value: OrderType.TAKEAWAY, label: 'Para llevar' },
  { value: OrderType.DELIVERY, label: 'Delivery' },
];

const paymentOptions: { value: PaymentMethod | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: PaymentMethod.CASH, label: 'Efectivo' },
  { value: PaymentMethod.CREDIT_CARD, label: 'T. Crédito' },
  { value: PaymentMethod.DEBIT_CARD, label: 'T. Débito' },
  { value: PaymentMethod.YAPE, label: 'Yape' },
  { value: PaymentMethod.PLIN, label: 'Plin' },
  { value: PaymentMethod.DIGITAL_WALLET, label: 'Billetera' },
];

const platformOptions: { value: DeliveryPlatform | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: DeliveryPlatform.UBER_EATS, label: 'Uber Eats' },
  { value: DeliveryPlatform.RAPPI, label: 'Rappi' },
  { value: DeliveryPlatform.PEDIDOS_YA, label: 'Pedidos Ya' },
  { value: DeliveryPlatform.DIDI_FOOD, label: 'DiDi Food' },
  { value: DeliveryPlatform.GLOVO, label: 'Glovo' },
  { value: DeliveryPlatform.INTERNAL, label: 'Interno' },
];

export default function OrdersPage() {
  const [page, setPage] = useState<PageResponse<OrderResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: PAGE_SIZE,
    page: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const [viewingOrder, setViewingOrder] = useState<OrderResponse | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== '',
  ).length;

  const buildParams = (pageNumber: number): GetOrdersParams => {
    const params: GetOrdersParams = {
      page: pageNumber,
      size: PAGE_SIZE,
      sort: ['createdAt,desc'],
    };
    if (filters.status) params.status = filters.status as OrderStatus;
    if (filters.orderType) params.orderType = filters.orderType as OrderType;
    if (filters.clientName.trim())
      params.clientName = filters.clientName.trim();
    if (filters.clientPhoneNumber.trim())
      params.clientPhoneNumber = filters.clientPhoneNumber.trim();
    if (filters.invoiceNumber.trim())
      params.invoiceNumber = filters.invoiceNumber.trim();
    if (filters.minTotal) params.minTotal = Number(filters.minTotal);
    if (filters.maxTotal) params.maxTotal = Number(filters.maxTotal);
    if (filters.minDate) params.minDate = filters.minDate;
    if (filters.maxDate) params.maxDate = filters.maxDate;
    if (filters.tableNumber) params.tableNumber = Number(filters.tableNumber);
    if (filters.paymentMethod)
      params.paymentMethod = filters.paymentMethod as PaymentMethod;
    if (filters.deliveryDriverName.trim())
      params.deliveryDriverName = filters.deliveryDriverName.trim();
    if (filters.deliveryDriverPlatform)
      params.deliveryDriverPlatform =
        filters.deliveryDriverPlatform as DeliveryPlatform;
    return params;
  };

  const fetchOrders = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data = await getOrders(buildParams(pageNumber));
      setPage(data);
      setCurrentPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchOrders(0);
  };

  const handleClearFilters = () => setFilters(defaultFilters);
  
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreCheck = async (order: OrderResponse) => {
    setDownloadingId(order.id);
    try {
      const blob = await getOrderPreCheck(order.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pre-cuenta-orden-${order.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

  const startItem = page.page * page.size + 1;
  const endItem = Math.min(
    startItem + page.content.length - 1,
    page.totalElements,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-start mb-8 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-red-800" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center flex-shrink-0">
            <ClipboardList size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Gestión de <span className="text-red-800">Órdenes</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              {loading ? '...' : `${page.totalElements} órdenes en total`}
            </p>
          </div>
        </div>
      </header>

      {/* Quick type filter tabs */}
      <div className="flex gap-1 mb-4 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {orderTypeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setFilters((p) => ({ ...p, orderType: opt.value }));
              fetchOrders(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.orderType === opt.value
                ? 'bg-red-800 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3"
      >
        <div className="flex gap-3 items-center flex-wrap">
          {/* Status */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-red-800 transition-all bg-white"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Invoice search */}
          <div className="relative flex-1 min-w-[160px]">
            <input
              name="invoiceNumber"
              value={filters.invoiceNumber}
              onChange={handleFilterChange}
              placeholder="N° de comprobante..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
              showFilters || activeFilterCount > 0
                ? 'border-red-800 bg-red-50 text-red-800'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-800 text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all"
            >
              <X size={13} />
              Limpiar
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-lg hover:bg-gray-700 transition-all uppercase tracking-wide ml-auto"
          >
            Buscar
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            {/* Cliente */}
            <div>
              <label className={labelClass}>Nombre cliente</label>
              <input
                name="clientName"
                value={filters.clientName}
                onChange={handleFilterChange}
                placeholder="Ej. Juan..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Teléfono cliente</label>
              <input
                name="clientPhoneNumber"
                value={filters.clientPhoneNumber}
                onChange={handleFilterChange}
                placeholder="Ej. 987..."
                className={inputClass}
              />
            </div>

            {/* Total */}
            <div>
              <label className={labelClass}>Total mínimo (S/)</label>
              <input
                type="number"
                name="minTotal"
                value={filters.minTotal}
                onChange={handleFilterChange}
                min={0}
                step={0.5}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Total máximo (S/)</label>
              <input
                type="number"
                name="maxTotal"
                value={filters.maxTotal}
                onChange={handleFilterChange}
                min={0}
                step={0.5}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            {/* Fechas */}
            <div>
              <label className={labelClass}>Desde</label>
              <input
                type="datetime-local"
                name="minDate"
                value={filters.minDate}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Hasta</label>
              <input
                type="datetime-local"
                name="maxDate"
                value={filters.maxDate}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>

            {/* Mesa */}
            <div>
              <label className={labelClass}>N° de mesa</label>
              <input
                type="number"
                name="tableNumber"
                value={filters.tableNumber}
                onChange={handleFilterChange}
                min={1}
                placeholder="Ej. 5"
                className={inputClass}
              />
            </div>

            {/* Pago */}
            <div>
              <label className={labelClass}>Método de pago</label>
              <select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                className={inputClass}
              >
                {paymentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery */}
            <div>
              <label className={labelClass}>Conductor delivery</label>
              <input
                name="deliveryDriverName"
                value={filters.deliveryDriverName}
                onChange={handleFilterChange}
                placeholder="Nombre..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Plataforma delivery</label>
              <select
                name="deliveryDriverPlatform"
                value={filters.deliveryDriverPlatform}
                onChange={handleFilterChange}
                className={inputClass}
              >
                {platformOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <OrdersTable
          orders={page.content}
          loading={loading}
          onView={setViewingOrder}
          onPreCheck={handlePreCheck}
        />

        {/* Pagination */}
        {!loading && page.totalElements > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Mostrando{' '}
              <span className="font-bold text-gray-600">
                {startItem}–{endItem}
              </span>{' '}
              de{' '}
              <span className="font-bold text-gray-600">
                {page.totalElements}
              </span>{' '}
              órdenes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchOrders(currentPage - 1)}
                disabled={currentPage === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: page.totalPages }, (_, i) => i)
                .filter((i) => Math.abs(i - currentPage) <= 2)
                .map((i) => (
                  <button
                    key={i}
                    onClick={() => fetchOrders(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      i === currentPage
                        ? 'bg-red-800 text-white'
                        : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              <button
                onClick={() => fetchOrders(currentPage + 1)}
                disabled={currentPage >= page.totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}

      {/* Downloading overlay */}
      {downloadingId !== null && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
          <Loader2 size={16} className="animate-spin text-red-800" />
          <span className="text-xs font-bold text-gray-700">
            Generando pre-cuenta #{downloadingId}...
          </span>
        </div>
      )}
    </div>
  );
}
