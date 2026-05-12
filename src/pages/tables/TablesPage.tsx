import { LayoutGrid, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTables } from '../../actions/tables/get-tables';
import {
  TableResponse,
  TableStatus,
} from '../../actions/tables/tables.interfaces';
import TableCard from '../../components/tables/TableCard';
import CreateTableModal from '../../components/tables/CreateTableModal';
import EditTableModal from '../../components/tables/EditTableModal';

const statusTabs: { value: TableStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: TableStatus.AVAILABLE, label: 'Disponibles' },
  { value: TableStatus.OCCUPIED, label: 'Ocupadas' },
  { value: TableStatus.RESERVED, label: 'Reservadas' },
  { value: TableStatus.OUT_OF_SERVICE, label: 'Fuera de Servicio' },
];

const statusDot: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: 'bg-emerald-500',
  [TableStatus.OCCUPIED]: 'bg-red-500',
  [TableStatus.RESERVED]: 'bg-blue-500',
  [TableStatus.OUT_OF_SERVICE]: 'bg-gray-400',
};

export default function TablesPage() {
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TableStatus | 'ALL'>('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [editingTable, setEditingTable] = useState<TableResponse | null>(null);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const data = await getTables({});
      setTables(data);
    } catch (err) {
      console.error('Error cargando mesas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleModalSuccess = () => {
    setShowCreate(false);
    setEditingTable(null);
    fetchTables();
  };

  const filtered =
    statusFilter === 'ALL'
      ? tables
      : tables.filter((t) => t.status === statusFilter);

  // Stats
  const countByStatus = (s: TableStatus) =>
    tables.filter((t) => t.status === s).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-start mb-8 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-red-800" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center flex-shrink-0">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Gestión de <span className="text-red-800">Mesas</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              Salón del restaurante
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} />
          Nueva Mesa
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            status: TableStatus.AVAILABLE,
            label: 'Disponibles',
            color: 'border-emerald-200',
            text: 'text-emerald-600',
          },
          {
            status: TableStatus.OCCUPIED,
            label: 'Ocupadas',
            color: 'border-red-200',
            text: 'text-red-600',
          },
          {
            status: TableStatus.RESERVED,
            label: 'Reservadas',
            color: 'border-blue-200',
            text: 'text-blue-600',
          },
          {
            status: TableStatus.OUT_OF_SERVICE,
            label: 'Fuera de Servicio',
            color: 'border-gray-200',
            text: 'text-gray-400',
          },
        ].map(({ status, label, color, text }) => (
          <div
            key={status}
            className={`bg-white rounded-xl border ${color} px-5 py-4 flex items-center gap-3`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot[status]}`}
            />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {label}
              </p>
              <p className={`text-2xl font-black ${text}`}>
                {countByStatus(status)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-5 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === tab.value
                ? 'bg-red-800 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.value !== 'ALL' && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  statusFilter === tab.value
                    ? 'bg-white/70'
                    : statusDot[tab.value as TableStatus]
                }`}
              />
            )}
            {tab.label}
            <span
              className={`text-[10px] font-black rounded-full px-1.5 py-0.5 ${
                statusFilter === tab.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tab.value === 'ALL'
                ? tables.length
                : countByStatus(tab.value as TableStatus)}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-red-800 rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Cargando...
            </span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <LayoutGrid size={40} className="mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">
            Sin mesas en esta categoría
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((table) => (
            <TableCard key={table.id} table={table} onEdit={setEditingTable} />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateTableModal
          onClose={() => setShowCreate(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {editingTable && (
        <EditTableModal
          table={editingTable}
          onClose={() => setEditingTable(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
