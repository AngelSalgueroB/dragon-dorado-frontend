import { SubmitEvent, useEffect, useState } from 'react';
import {
  DeliveryDriverResponse,
  DeliveryPlatform,
  GetDeliveryDriversParams,
} from '../../actions/delivery-drivers/delivery-drivers.interface';
import { getDeliveryDrivers } from '../../actions/delivery-drivers/get-delivery-drivers';
import { Plus, Search, SlidersHorizontal, Truck } from 'lucide-react';
import DriverTable from '../../components/drivers/DriverTable';
import CreateDriverModal from '../../components/drivers/CreateDriverModal';
import EditDriverModal from '../../components/drivers/EditDriverModal';

const platformFilterOptions: { value: DeliveryPlatform | ''; label: string }[] =
  [
    { value: '', label: 'Todas las plataformas' },
    { value: DeliveryPlatform.UBER_EATS, label: 'Uber Eats' },
    { value: DeliveryPlatform.RAPPI, label: 'Rappi' },
    { value: DeliveryPlatform.PEDIDOS_YA, label: 'Pedidos Ya' },
    { value: DeliveryPlatform.DIDI_FOOD, label: 'DiDi Food' },
    { value: DeliveryPlatform.GLOVO, label: 'Glovo' },
    { value: DeliveryPlatform.INTERNAL, label: 'Interno' },
  ];

export default function DriversPage() {
  const [drivers, setDrivers] = useState<DeliveryDriverResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<DeliveryPlatform | ''>(
    '',
  );
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editingDriver, setEditingDriver] =
    useState<DeliveryDriverResponse | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const params: GetDeliveryDriversParams = {};
      if (search) params.name = search;
      if (platformFilter) params.platform = platformFilter;
      if (activeFilter === 'active') params.active = true;
      if (activeFilter === 'inactive') params.active = false;

      const data = await getDeliveryDrivers(params);
      setDrivers(data);
    } catch (err) {
      console.error('Error cargando conductores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformFilter, activeFilter]);

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchDrivers();
  };

  const handleModalSuccess = () => {
    setShowCreate(false);
    setEditingDriver(null);
    fetchDrivers();
  };

  const activeCount = drivers.filter((d) => d.active).length;
  const inactiveCount = drivers.filter((d) => !d.active).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-start mb-8 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-red-800" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center flex-shrink-0">
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Conductores de <span className="text-red-800">Delivery</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              Gestión de repartidores
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} />
          Nuevo Conductor
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total
          </p>
          <p className="text-3xl font-black text-gray-900">{drivers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 px-5 py-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Activos
          </p>
          <p className="text-3xl font-black text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Inactivos
          </p>
          <p className="text-3xl font-black text-gray-400">{inactiveCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 flex-1 min-w-[200px]"
        >
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-700 transition-all"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-400" />
          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) =>
              setPlatformFilter(e.target.value as DeliveryPlatform | '')
            }
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-red-800 transition-all text-gray-700"
          >
            {platformFilterOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Active filter */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(['all', 'active', 'inactive'] as const).map((val) => (
              <button
                key={val}
                onClick={() => setActiveFilter(val)}
                className={`px-3 py-2 text-xs font-bold transition-all ${
                  activeFilter === val
                    ? 'bg-red-800 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {val === 'all'
                  ? 'Todos'
                  : val === 'active'
                    ? 'Activos'
                    : 'Inactivos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <DriverTable
          drivers={drivers}
          loading={loading}
          onEdit={setEditingDriver}
        />
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateDriverModal
          onClose={() => setShowCreate(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {editingDriver && (
        <EditDriverModal
          driver={editingDriver}
          onClose={() => setEditingDriver(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
