import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react';
import { ChangeEvent, SubmitEvent, useEffect, useState } from 'react';
import {
  ClientResponse,
  GetClientsParams,
} from '../../actions/clients/clients.interfaces';
import { getClients } from '../../actions/clients/get-clients';
import { DocumentType, PageResponse } from '../../actions/common';
import ClientTable from '../../components/clients/ClientTable';
import CreateClientModal from '../../components/clients/CreateClientModal';
import EditClientModal from '../../components/clients/EditClientModal';
import { toLocalDateTime } from '../../utils/convert-to-localdatetime';

const PAGE_SIZE = 10;

const documentOptions = [
  { value: DocumentType.DNI, label: 'DNI' },
  { value: DocumentType.RUC, label: 'RUC' },
];

interface Filters {
  name: string;
  documentType: DocumentType | '';
  documentNumber: string;
  phoneNumber: string;
  email: string;
  active: 'all' | 'true' | 'false';
  startDate: string;
  endDate: string;
}

const defaultFilters: Filters = {
  name: '',
  documentType: '',
  documentNumber: '',
  phoneNumber: '',
  email: '',
  active: 'all',
  startDate: '',
  endDate: '',
};

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400 bg-white';
const labelClass =
  'block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1';

export default function ClientsPage() {
  const [page, setPage] = useState<PageResponse<ClientResponse>>({
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

  const [showCreate, setShowCreate] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(
    null,
  );

  const activeFilterCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'active') return val !== 'all';
    return val !== '';
  }).length;

  const buildParams = (pageNumber: number): GetClientsParams => {
    const params: GetClientsParams = {
      page: pageNumber,
      size: PAGE_SIZE,
      sort: ['createdAt,desc'],
    };
    if (filters.name.trim()) params.name = filters.name.trim();
    if (filters.documentType)
      params.documentType = filters.documentType as DocumentType;
    if (filters.documentNumber.trim())
      params.documentNumber = filters.documentNumber.trim();
    if (filters.phoneNumber.trim())
      params.phoneNumber = filters.phoneNumber.trim();
    if (filters.email.trim()) params.email = filters.email.trim();
    if (filters.active !== 'all') params.active = filters.active === 'true';
    if (filters.startDate)
      params.startDate = toLocalDateTime(filters.startDate);
    if (filters.endDate) params.endDate = toLocalDateTime(filters.endDate);
    return params;
  };

  const fetchClients = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data = await getClients(buildParams(pageNumber));
      setPage(data);
      setCurrentPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(0);
  }, []);

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchClients(0);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(0);
  };

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSuccess = () => {
    setShowCreate(false);
    setEditingClient(null);
    fetchClients(currentPage);
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
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Gestión de <span className="text-red-800">Clientes</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              {loading ? '...' : `${page.totalElements} clientes registrados`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} />
          Nuevo Cliente
        </button>
      </header>

      {/* Search + filter bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3"
      >
        {/* Top row: search + toggle */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all"
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
            className="px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-lg hover:bg-gray-700 transition-all uppercase tracking-wide"
          >
            Buscar
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            {/* Tipo + número documento */}
            <div>
              <label className={labelClass}>Tipo de documento</label>
              <select
                name="documentType"
                value={filters.documentType}
                onChange={handleFilterChange}
                className={inputClass}
              >
                <option value="">Todos</option>
                {documentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Número de documento</label>
              <input
                name="documentNumber"
                value={filters.documentNumber}
                onChange={handleFilterChange}
                placeholder="Ej. 12345678"
                className={inputClass}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                name="phoneNumber"
                value={filters.phoneNumber}
                onChange={handleFilterChange}
                placeholder="Ej. 987654321"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Ej. cliente@email.com"
                className={inputClass}
              />
            </div>

            {/* Estado */}
            <div>
              <label className={labelClass}>Estado</label>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {(
                  [
                    ['all', 'Todos'],
                    ['true', 'Activos'],
                    ['false', 'Inactivos'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, active: val }))}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${
                      filters.active === val
                        ? 'bg-red-800 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha desde */}
            <div>
              <label className={labelClass}>Desde</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <label className={labelClass}>Hasta</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>
          </div>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <ClientTable
          clients={page.content}
          loading={loading}
          onEdit={setEditingClient}
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
              clientes
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchClients(currentPage - 1)}
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
                    onClick={() => fetchClients(i)}
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
                onClick={() => fetchClients(currentPage + 1)}
                disabled={currentPage >= page.totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateClientModal
          onClose={() => setShowCreate(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
