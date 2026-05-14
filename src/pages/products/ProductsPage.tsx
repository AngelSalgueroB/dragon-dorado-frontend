import {
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ChangeEvent, SubmitEvent, useEffect, useState } from 'react';
import { getProducts } from '../../actions/products/get-products';
import {
  GetProductsParams,
  ProductResponse,
} from '../../actions/products/products.interfaces';
import { PageResponse } from '../../actions/common';
import { getCategories } from '../../actions/category/get-categories';
import { CategoryResponse } from '../../actions/category/category.interfaces';
import ProductCard from '../../components/products/ProductCard';
import CreateProductModal from '../../components/products/CreateProductModal';
import EditProductModal from '../../components/products/EditProductModal';
import { toLocalDateTime } from '../../utils/convert-to-localdatetime';

const PAGE_SIZE = 12;

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400 bg-white';
const labelClass =
  'block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1';

interface Filters {
  name: string;
  categoryId: number | '';
  minPrice: string;
  maxPrice: string;
  active: 'all' | 'true' | 'false';
  minDate: string;
  maxDate: string;
}

const defaultFilters: Filters = {
  name: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  active: 'all',
  minDate: '',
  maxDate: '',
};

export default function ProductsPage() {
  const [page, setPage] = useState<PageResponse<ProductResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: PAGE_SIZE,
    page: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(
    null,
  );

  const activeFilterCount = Object.entries(filters).filter(([key, val]) =>
    key === 'active' ? val !== 'all' : val !== '',
  ).length;

  const buildParams = (pageNumber: number): GetProductsParams => {
    const params: GetProductsParams = {
      page: pageNumber,
      size: PAGE_SIZE,
      sort: ['createdAt,desc'],
    };
    if (filters.name.trim()) params.name = filters.name.trim();
    if (filters.categoryId !== '')
      params.categoryId = Number(filters.categoryId);
    if (filters.minPrice) params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
    if (filters.active !== 'all') params.active = filters.active === 'true';
    if (filters.minDate) params.minDate = toLocalDateTime(filters.minDate);
    if (filters.maxDate) params.maxDate = toLocalDateTime(filters.maxDate);
    return params;
  };

  const fetchProducts = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data = await getProducts(buildParams(pageNumber));
      setPage(data);
      setCurrentPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts(0);
    fetchCategories();
  }, []);

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchProducts(0);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  useEffect(() => {
    const isClean = Object.entries(filters).every(([key, val]) =>
      key === 'active' ? val === 'all' : val === '',
    );
    if (isClean) fetchProducts(0);
  }, [filters]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSuccess = () => {
    setShowCreate(false);
    setEditingProduct(null);
    fetchProducts(currentPage);
    fetchCategories();
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
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Gestión de <span className="text-red-800">Productos</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              {loading ? '...' : `${page.totalElements} productos en total`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} />
          Nuevo Producto
        </button>
      </header>

      {/* Search + filters */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3"
      >
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

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            {/* Categoría */}
            <div>
              <label className={labelClass}>Categoría</label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                className={inputClass}
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio mín */}
            <div>
              <label className={labelClass}>Precio mínimo (S/)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                min={0}
                step={0.5}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            {/* Precio máx */}
            <div>
              <label className={labelClass}>Precio máximo (S/)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                min={0}
                step={0.5}
                placeholder="0.00"
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

            {/* Desde */}
            <div>
              <label className={labelClass}>Desde</label>
              <input
                type="date"
                name="minDate"
                value={filters.minDate}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>

            {/* Hasta */}
            <div>
              <label className={labelClass}>Hasta</label>
              <input
                type="date"
                name="maxDate"
                value={filters.maxDate}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>
          </div>
        )}
      </form>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-red-800 rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
              Cargando...
            </span>
          </div>
        </div>
      ) : page.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Package size={40} className="mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">Sin productos</p>
          <p className="text-xs text-gray-400 mt-1">
            Prueba con otros filtros o crea uno nuevo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {page.content.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={setEditingProduct}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && page.totalElements > 0 && (
        <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-400">
            Mostrando{' '}
            <span className="font-bold text-gray-600">
              {startItem}–{endItem}
            </span>{' '}
            de{' '}
            <span className="font-bold text-gray-600">
              {page.totalElements}
            </span>{' '}
            productos
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchProducts(currentPage - 1)}
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
                  onClick={() => fetchProducts(i)}
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
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage >= page.totalPages - 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateProductModal
          categories={categories}
          onClose={() => setShowCreate(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
