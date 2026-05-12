import { X } from 'lucide-react';
import { SubmitEvent, useState } from 'react';
import { CreateTableRequest } from '../../actions/tables/tables.interfaces';
import { createTable } from '../../actions/tables/create-table';

interface CreateTableModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400';
const labelClass =
  'block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1';

export default function CreateTableModal({
  onClose,
  onSuccess,
}: CreateTableModalProps) {
  const [form, setForm] = useState<CreateTableRequest>({
    name: '',
    description: '',
    number: 1,
    capacity: 4,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreateTableRequest = {
        number: form.number,
        capacity: form.capacity,
        ...(form.name && { name: form.name }),
        ...(form.description && { description: form.description }),
      };
      await createTable(payload);
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
              Nueva Mesa
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Agrega una mesa al salón
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
          {/* Number + Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Número de mesa *</label>
              <input
                type="number"
                name="number"
                min={1}
                value={form.number}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
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
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>
              Nombre{' '}
              <span className="text-gray-300 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
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
              {loading ? 'Guardando...' : 'Crear Mesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
