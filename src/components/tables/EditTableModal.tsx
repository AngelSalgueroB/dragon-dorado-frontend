import { X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { updateTable } from '../../actions/tables/update-table';
import {
  TableResponse,
  TableStatus,
  UpdateTableRequest,
} from '../../actions/tables/tables.interfaces';

interface EditTableModalProps {
  table: TableResponse;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400';
const labelClass =
  'block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1';

const statusOptions: { value: TableStatus; label: string }[] = [
  { value: TableStatus.AVAILABLE, label: 'Disponible' },
  { value: TableStatus.OCCUPIED, label: 'Ocupada' },
  { value: TableStatus.RESERVED, label: 'Reservada' },
  { value: TableStatus.OUT_OF_SERVICE, label: 'Fuera de Servicio' },
];

export default function EditTableModal({
  table,
  onClose,
  onSuccess,
}: EditTableModalProps) {
  const [form, setForm] = useState<UpdateTableRequest>({
    name: table.name ?? '',
    description: table.description ?? '',
    capacity: table.capacity,
    status: table.status,
    active: table.active,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: table.name ?? '',
      description: table.description ?? '',
      capacity: table.capacity,
      status: table.status,
      active: table.active,
    });
  }, [table]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTable(table.id, form);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">
              Editar Mesa
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Mesa #{table.number} · {table.name || 'Sin nombre'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name + Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <label className={labelClass}>Capacidad *</label>
              <input
                type="number"
                name="capacity"
                min={1}
                value={form.capacity}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Estado *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Nombre *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ej. Mesa del jardín"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Descripción{' '}
              <span className="text-gray-300 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ej. Cerca a la ventana, sector VIP..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-700">
                Estado de la mesa
              </p>
              <p className="text-xs text-gray-400">
                {form.active
                  ? 'La mesa está activa y visible'
                  : 'La mesa está desactivada'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800" />
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-800 text-white text-sm font-black uppercase tracking-wide hover:bg-red-900 disabled:opacity-60 transition-all"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
