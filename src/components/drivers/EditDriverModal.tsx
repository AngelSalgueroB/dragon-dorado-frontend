import { X } from 'lucide-react';
import { ChangeEvent, SubmitEvent, useEffect, useState } from 'react';
import {
  DeliveryDriverResponse,
  DeliveryPlatform,
  UpdateDeliveryDriverRequest,
} from '../../actions/delivery-drivers/delivery-drivers.interface';
import { updateDeliveryDriver } from '../../actions/delivery-drivers/update-delivery-driver';

interface EditDriverModalProps {
  driver: DeliveryDriverResponse;
  onClose: () => void;
  onSuccess: () => void;
}

const platformOptions = [
  { value: DeliveryPlatform.UBER_EATS, label: 'Uber Eats' },
  { value: DeliveryPlatform.RAPPI, label: 'Rappi' },
  { value: DeliveryPlatform.PEDIDOS_YA, label: 'Pedidos Ya' },
  { value: DeliveryPlatform.DIDI_FOOD, label: 'DiDi Food' },
  { value: DeliveryPlatform.GLOVO, label: 'Glovo' },
  { value: DeliveryPlatform.INTERNAL, label: 'Interno' },
];

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400';

const labelClass =
  'block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1';

export default function EditDriverModal({
  driver,
  onClose,
  onSuccess,
}: EditDriverModalProps) {
  const [form, setForm] = useState<UpdateDeliveryDriverRequest>({
    name: driver.name,
    platform: driver.platform,
    phoneNumber: driver.phoneNumber,
    active: driver.active,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      name: driver.name,
      platform: driver.platform,
      phoneNumber: driver.phoneNumber,
      active: driver.active,
    });
  }, [driver]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateDeliveryDriver(driver.id, form);
      onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? 'Error al actualizar el conductor',
      );
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
              Editar Conductor
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
              {driver.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Plataforma */}
          <div>
            <label className={labelClass}>Plataforma</label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className={inputClass}
            >
              {platformOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className={labelClass}>Teléfono</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Estado activo */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-700">Estado</p>
              <p className="text-xs text-gray-400">
                {form.active
                  ? 'El conductor está activo'
                  : 'El conductor está inactivo'}
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
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800" />
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
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
