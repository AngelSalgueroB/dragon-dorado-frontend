import { Armchair, Pencil } from 'lucide-react';
import {
  TableResponse,
  TableStatus,
} from '../../actions/tables/tables.interfaces';

interface TableCardProps {
  table: TableResponse;
  onEdit: (table: TableResponse) => void;
}

const statusConfig: Record<
  TableStatus,
  { label: string; dot: string; bg: string; border: string; text: string }
> = {
  [TableStatus.AVAILABLE]: {
    label: 'Disponible',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  [TableStatus.OCCUPIED]: {
    label: 'Ocupada',
    dot: 'bg-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
  },
  [TableStatus.RESERVED]: {
    label: 'Reservada',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  [TableStatus.OUT_OF_SERVICE]: {
    label: 'Fuera de Servicio',
    dot: 'bg-gray-400',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-500',
  },
};

const cardBorder: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: 'border-emerald-300 hover:border-emerald-400',
  [TableStatus.OCCUPIED]: 'border-red-300 hover:border-red-400',
  [TableStatus.RESERVED]: 'border-blue-300 hover:border-blue-400',
  [TableStatus.OUT_OF_SERVICE]: 'border-gray-200 hover:border-gray-300',
};

export default function TableCard({ table, onEdit }: TableCardProps) {
  const cfg = statusConfig[table.status];

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-md group ${
        table.active ? cardBorder[table.status] : 'border-gray-200 opacity-60'
      }`}
    >
      {/* Edit button */}
      <button
        onClick={() => onEdit(table)}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100"
        title="Editar mesa"
      >
        <Pencil size={13} />
      </button>

      {/* Table number */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-lg leading-none">
            {table.number}
          </span>
        </div>
        {!table.active && (
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Inactiva
          </span>
        )}
      </div>

      {/* Name */}
      <p className="font-black text-gray-900 text-sm uppercase tracking-tight leading-tight mb-0.5">
        {table.name || `Mesa ${table.number}`}
      </p>
      {table.description && (
        <p className="text-xs text-gray-400 mb-3 truncate">
          {table.description}
        </p>
      )}
      {!table.description && <div className="mb-3" />}

      {/* Capacity */}
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <Armchair size={13} className="text-gray-400" />
        <span className="font-semibold">{table.capacity}</span>
        <span>{table.capacity === 1 ? 'persona' : 'personas'}</span>
      </div>

      {/* Status badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.border} border ${cfg.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </div>
    </div>
  );
}
