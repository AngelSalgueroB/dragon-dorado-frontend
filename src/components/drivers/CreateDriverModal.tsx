import { X } from 'lucide-react';
import { ChangeEvent, SubmitEvent, useState } from 'react';
import {
  CreateDeliveryDriverRequest,
  DeliveryPlatform,
} from '../../actions/delivery-drivers/delivery-drivers.interface';
import { DocumentType } from '../../actions/common';
import { createDeliveryDriver } from '../../actions/delivery-drivers/create-delivery-driver';

interface CreateDriverModalProps {
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

const documentOptions = [
  { value: DocumentType.DNI, label: 'DNI' },
  { value: DocumentType.RUC, label: 'RUC' },
];

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400';

const labelClass =
  'block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1';

export default function CreateDriverModal({
  onClose,
  onSuccess,
}: CreateDriverModalProps) {
  const [form, setForm] = useState<CreateDeliveryDriverRequest>({
    name: '',
    platform: DeliveryPlatform.INTERNAL,
    phoneNumber: '',
    documentType: DocumentType.DNI,
    documentNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createDeliveryDriver(form);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear el conductor');
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
              Nuevo Conductor
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Completa los datos del repartidor
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
              placeholder="Ej. Juan Pérez"
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
              placeholder="Ej. 987654321"
              className={inputClass}
            />
          </div>

          {/* Documento */}
          <div className="flex gap-3">
            <div className="w-36 flex-shrink-0">
              <label className={labelClass}>Tipo</label>
              <select
                name="documentType"
                value={form.documentType}
                onChange={handleChange}
                className={inputClass}
              >
                {documentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Número</label>
              <input
                name="documentNumber"
                value={form.documentNumber}
                onChange={handleChange}
                required
                placeholder="Ej. 12345678"
                className={inputClass}
              />
            </div>
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
              {loading ? 'Guardando...' : 'Crear Conductor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
