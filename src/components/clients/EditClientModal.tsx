import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  ClientResponse,
  UpdateClientRequest,
} from '../../actions/clients/clients.interfaces';
import { updateClient } from '../../actions/clients/update-client';
import { toast } from 'react-toastify';

interface EditClientModalProps {
  client: ClientResponse;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass =
  'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400';
const labelClass =
  'block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1';

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

export default function EditClientModal({
  client,
  onClose,
  onSuccess,
}: EditClientModalProps) {
  const [form, setForm] = useState<UpdateClientRequest>({
    name: client.name,
    phoneNumber: client.phoneNumber,
    email: client.email ?? '',
    active: client.active,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: client.name,
      phoneNumber: client.phoneNumber,
      email: client.email ?? '',
      active: client.active,
    });
    setErrors({});
  }, [client]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El teléfono es obligatorio';
    } else if (!/^\d{7,15}$/.test(form.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Ingresa un teléfono válido (7-15 dígitos)';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: UpdateClientRequest = {
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        active: form.active,
        ...(form.email?.trim() && { email: form.email.trim() }),
      };
      await updateClient(client.id, payload);
      toast.success('Cliente actualizado exitosamente');
      onSuccess();
    } catch {
      // Errors handled globally by apiClient interceptor (toast)
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: keyof FormErrors) =>
    `${inputClass} ${errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-red-800 focus:ring-red-800'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">
              Editar Cliente
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
              {client.name}
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
          {/* Nombre */}
          <div>
            <label className={labelClass}>Nombre completo *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={fieldClass('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className={labelClass}>Teléfono *</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={fieldClass('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              Email{' '}
              <span className="text-gray-300 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email ?? ''}
              onChange={handleChange}
              placeholder="Ej. cliente@email.com"
              className={fieldClass('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Activo toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-700">
                Estado del cliente
              </p>
              <p className="text-xs text-gray-400">
                {form.active ? 'Cliente activo' : 'Cliente inactivo'}
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
