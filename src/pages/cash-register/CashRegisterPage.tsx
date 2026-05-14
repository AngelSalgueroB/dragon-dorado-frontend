import {
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  LockKeyholeOpen,
  Plus,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { getCashRegisters } from '../../actions/cash-register/get-cash-registers';
import {
  CashRegisterResponse,
  CashRegisterStatus,
  GetCashRegistersParams,
} from '../../actions/cash-register/cash-register.interfaces';
import { PageResponse } from '../../actions/common';
import CashRegisterTable from '../../components/cash-register/CashRegisterTable';
import OpenCashRegisterModal from '../../components/cash-register/OpenCashRegisterModal';
import CloseCashRegisterModal from '../../components/cash-register/CloseCashRegisterModal';

const PAGE_SIZE = 10;

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400 bg-white';
const labelClass =
  'block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1';

interface Filters {
  status: CashRegisterStatus | 'all';
  openingTime: string;
  closingTime: string;
}

const defaultFilters: Filters = {
  status: 'all',
  openingTime: '',
  closingTime: '',
};

export default function CashRegisterPage() {
  const [page, setPage] = useState<PageResponse<CashRegisterResponse>>({
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

  const [showOpen, setShowOpen] = useState(false);
  const [closingRegister, setClosingRegister] =
    useState<CashRegisterResponse | null>(null);

  const activeFilterCount = Object.entries(filters).filter(([key, val]) =>
    key === 'status' ? val !== 'all' : val !== '',
  ).length;

  const buildParams = (pageNumber: number): GetCashRegistersParams => {
    const params: GetCashRegistersParams = {
      page: pageNumber,
      size: PAGE_SIZE,
      sort: ['createdAt,desc'],
    };
    if (filters.status !== 'all')
      params.status = filters.status as CashRegisterStatus;
    if (filters.openingTime) params.openingTime = filters.openingTime;
    if (filters.closingTime) params.closingTime = filters.closingTime;
    return params;
  };

  const fetchRegisters = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data = await getCashRegisters(buildParams(pageNumber));
      setPage(data);
      setCurrentPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisters(0);
  }, [filters]);

  const handleClearFilters = () => setFilters(defaultFilters);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSuccess = () => {
    setShowOpen(false);
    setClosingRegister(null);
    fetchRegisters(currentPage);
  };

  // Derived stats
  const openCount = page.content.filter(
    (r) => r.status === CashRegisterStatus.OPEN,
  ).length;
  const closedCount = page.content.filter(
    (r) => r.status === CashRegisterStatus.CLOSED,
  ).length;
  const hasOpenRegister = page.content.some(
    (r) => r.status === CashRegisterStatus.OPEN,
  );

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
            <LockKeyholeOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Registros de <span className="text-red-800">Caja</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              {loading ? '...' : `${page.totalElements} registros en total`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowOpen(true)}
          disabled={hasOpenRegister}
          title={
            hasOpenRegister ? 'Ya hay una caja abierta' : 'Abrir nueva caja'
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} />
          Abrir Caja
        </button>
      </header>

      {/* Stats */}
      {!loading && page.content.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              En esta página
            </p>
            <p className="text-3xl font-black text-gray-900">
              {page.content.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 px-5 py-4 flex items-center gap-3">
            <LockKeyholeOpen size={18} className="text-emerald-600" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Abiertas
              </p>
              <p className="text-2xl font-black text-emerald-600">
                {openCount}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
            <LockKeyhole size={18} className="text-gray-400" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Cerradas
              </p>
              <p className="text-2xl font-black text-gray-500">{closedCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
        <div className="flex gap-3 items-center">
          {/* Status quick filter */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(
              [
                ['all', 'Todos'],
                [CashRegisterStatus.OPEN, 'Abiertas'],
                [CashRegisterStatus.CLOSED, 'Cerradas'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setFilters((p) => ({ ...p, status: val }));
                }}
                className={`px-3 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filters.status === val
                    ? 'bg-red-800 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {val === CashRegisterStatus.OPEN && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${filters.status === val ? 'bg-white/70' : 'bg-emerald-500'}`}
                  />
                )}
                {val === CashRegisterStatus.CLOSED && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${filters.status === val ? 'bg-white/70' : 'bg-gray-400'}`}
                  />
                )}
                {label}
              </button>
            ))}
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
            Filtros de fecha
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
            type="button"
            onClick={() => fetchRegisters(0)}
            className="ml-auto px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-lg hover:bg-gray-700 transition-all uppercase tracking-wide"
          >
            Buscar
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className={labelClass}>Fecha de apertura</label>
              <input
                type="datetime-local"
                name="openingTime"
                value={filters.openingTime}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Fecha de cierre</label>
              <input
                type="datetime-local"
                name="closingTime"
                value={filters.closingTime}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <CashRegisterTable
          registers={page.content}
          loading={loading}
          onClose={setClosingRegister}
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
              registros
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchRegisters(currentPage - 1)}
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
                    onClick={() => fetchRegisters(i)}
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
                onClick={() => fetchRegisters(currentPage + 1)}
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
      {showOpen && (
        <OpenCashRegisterModal
          onClose={() => setShowOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {closingRegister && (
        <CloseCashRegisterModal
          register={closingRegister}
          onClose={() => setClosingRegister(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
