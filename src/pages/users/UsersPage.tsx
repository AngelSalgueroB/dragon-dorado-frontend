import { Plus, Search, SlidersHorizontal, UserCog, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { getUsers } from '../../actions/users/get-users';
import {
    GetUsersParams,
    Role,
    UserResponse,
} from '../../actions/users/users.interfaces';
import CreateUserModal from '../../components/users/CreateUserModal';
import ToggleActiveModal from '../../components/users/ToggleActiveModal';
import UserTable from '../../components/users/UserTable';

const roleOptions: { value: Role | ''; label: string }[] = [
  { value: '', label: 'Todos los roles' },
  { value: Role.ADMIN, label: 'Admin' },
  { value: Role.MANAGER, label: 'Gerente' },
  { value: Role.WAITER, label: 'Mesero' },
  { value: Role.CASHIER, label: 'Cajero' },
  { value: Role.KITCHEN, label: 'Cocina' },
];

const roleCounts = (users: UserResponse[], role: Role) =>
  users.filter((u) => u.role === role).length;

interface Filters {
  fullName: string;
  username: string;
  email: string;
  role: Role | '';
  active: 'all' | 'true' | 'false';
  startDate: string;
  endDate: string;
}

const defaultFilters: Filters = {
  fullName: '',
  username: '',
  email: '',
  role: '',
  active: 'all',
  startDate: '',
  endDate: '',
};

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400 bg-white';
const labelClass =
  'block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1';

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [togglingUser, setTogglingUser] = useState<UserResponse | null>(null);

  const activeFilterCount = Object.entries(filters).filter(([key, val]) =>
    key === 'active' ? val !== 'all' : val !== '',
  ).length;

  const buildParams = (): GetUsersParams => {
    const params: GetUsersParams = {};
    if (filters.fullName.trim()) params.fullName = filters.fullName.trim();
    if (filters.username.trim()) params.username = filters.username.trim();
    if (filters.email.trim()) params.email = filters.email.trim();
    if (filters.role) params.role = filters.role as Role;
    if (filters.active !== 'all') params.active = filters.active === 'true';
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    return params;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(buildParams());
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  useEffect(() => {
    const isClean = Object.entries(filters).every(([key, val]) =>
      key === 'active' ? val === 'all' : val === '',
    );
    if (isClean) fetchUsers();
  }, [filters]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSuccess = () => {
    setShowCreate(false);
    setTogglingUser(null);
    fetchUsers();
  };

  const activeCount = users.filter((u) => u.active).length;
  const inactiveCount = users.filter((u) => !u.active).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-start mb-8 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-red-800" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center flex-shrink-0">
            <UserCog size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Gestión de <span className="text-red-800">Usuarios</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              {loading ? '...' : `${users.length} usuarios registrados`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </header>

      {/* Stats */}
      {!loading && users.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Total
            </p>
            <p className="text-2xl font-black text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 px-4 py-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Activos
            </p>
            <p className="text-2xl font-black text-emerald-600">
              {activeCount}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Inactivos
            </p>
            <p className="text-2xl font-black text-gray-400">{inactiveCount}</p>
          </div>
          {(
            [
              [Role.MANAGER, 'Gerentes', 'text-purple-600'],
              [Role.WAITER, 'Meseros', 'text-blue-600'],
              [Role.CASHIER, 'Cajeros', 'text-yellow-600'],
              [Role.KITCHEN, 'Cocina', 'text-orange-600'],
            ] as const
          ).map(([role, label, color]) => (
            <div
              key={role}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3"
            >
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {label}
              </p>
              <p className={`text-2xl font-black ${color}`}>
                {roleCounts(users, role)}
              </p>
            </div>
          ))}
        </div>
      )}

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
              name="fullName"
              value={filters.fullName}
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
            {/* Username */}
            <div>
              <label className={labelClass}>Usuario</label>
              <input
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                placeholder="Ej. jperez"
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
                placeholder="Ej. juan@chifa.com"
                className={inputClass}
              />
            </div>

            {/* Rol */}
            <div>
              <label className={labelClass}>Rol</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className={inputClass}
              >
                {roleOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
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
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>

            {/* Hasta */}
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <UserTable
          users={users}
          loading={loading}
          onToggleActive={setTogglingUser}
        />
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {togglingUser && (
        <ToggleActiveModal
          user={togglingUser}
          onClose={() => setTogglingUser(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
