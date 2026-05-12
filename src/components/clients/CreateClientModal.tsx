import { X } from 'lucide-react';
import { useState } from 'react';
import { DocumentType } from '../../actions/common';
import { CreateClientRequest } from '../../actions/clients/clients.interfaces';
import { createClient } from '../../actions/clients/create-client';
import { toast } from 'react-toastify';

interface CreateClientModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const documentOptions = [
  { value: DocumentType.DNI, label: 'DNI' },
  { value: DocumentType.RUC, label: 'RUC' },
];

const inputClass =
  'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400';
const labelClass =
  'block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1';

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
  documentNumber?: string;
}

export default function CreateClientModal({
  onClose,
  onSuccess,
}: CreateClientModalProps) {
  const [form, setForm] = useState<CreateClientRequest>({
    name: '',
    phoneNumber: '',
    email: '',
    documentType: DocumentType.DNI,
    documentNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

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

    if (form.documentType && !form.documentNumber?.trim()) {
      newErrors.documentNumber = 'Ingresa el número de documento';
    }

    if (form.documentNumber?.trim() && !form.documentType) {
      newErrors.documentNumber = 'Selecciona el tipo de documento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: CreateClientRequest = {
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        ...(form.email?.trim() && { email: form.email.trim() }),
        ...(form.documentType && {
          documentType: form.documentType as DocumentType,
        }),
        ...(form.documentNumber?.trim() && {
          documentNumber: form.documentNumber.trim(),
        }),
      };
      await createClient(payload);
      toast.success('Cliente creado exitosamente');
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
              Nuevo Cliente
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Completa los datos del cliente
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
              placeholder="Ej. María García"
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
              placeholder="Ej. 987654321"
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
              value={form.email}
              onChange={handleChange}
              placeholder="Ej. maria@email.com"
              className={fieldClass('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Documento */}
          <div className="flex gap-3">
            <div className="w-40 flex-shrink-0">
              <label className={labelClass}>
                Tipo doc.{' '}
                <span className="text-gray-300 normal-case font-normal">
                  (opc.)
                </span>
              </label>
              <select
                name="documentType"
                value={form.documentType}
                onChange={handleChange}
                className={`${fieldClass('documentNumber')} `}
              >
                <option value="">— Tipo —</option>
                {documentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>
                Número{' '}
                <span className="text-gray-300 normal-case font-normal">
                  (opc.)
                </span>
              </label>
              <input
                name="documentNumber"
                value={form.documentNumber}
                onChange={handleChange}
                placeholder="Ej. 12345678"
                className={fieldClass('documentNumber')}
              />
              {errors.documentNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.documentNumber}
                </p>
              )}
            </div>
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
              {loading ? 'Guardando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
