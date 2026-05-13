import { X } from 'lucide-react';
import { ChangeEvent, SubmitEvent, useState } from 'react';
import {
  CreateUserRequest,
  CreateUserRole,
} from '../../actions/users/users.interfaces';
import { createUser } from '../../actions/users/create-user';
import { toast } from 'react-toastify';

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions: { value: CreateUserRole; label: string; desc: string }[] = [
  {
    value: CreateUserRole.MANAGER,
    label: 'Gerente',
    desc: 'Acceso completo excepto admin',
  },
  {
    value: CreateUserRole.WAITER,
    label: 'Mesero',
    desc: 'Gestión de mesas y órdenes',
  },
  {
    value: CreateUserRole.CASHIER,
    label: 'Cajero',
    desc: 'Caja y facturación',
  },
  {
    value: CreateUserRole.KITCHEN,
    label: 'Cocina',
    desc: 'Monitor de cocina (KDS)',
  },
];

const inputClass =
  'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400';
const labelClass =
  'block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export default function CreateUserModal({
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    role: CreateUserRole.WAITER,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.firstName.trim())
      newErrors.firstName = 'El nombre es obligatorio';
    else if (form.firstName.trim().length < 2)
      newErrors.firstName = 'Mínimo 2 caracteres';

    if (!form.lastName.trim())
      newErrors.lastName = 'El apellido es obligatorio';
    else if (form.lastName.trim().length < 2)
      newErrors.lastName = 'Mínimo 2 caracteres';

    if (!form.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      newErrors.email = 'Ingresa un email válido';

    if (!form.role) newErrors.role = 'Selecciona un rol';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await createUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        role: form.role,
      });
      toast.success(response.message);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: keyof FormErrors) =>
    `${inputClass} ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-gray-200 focus:border-red-800 focus:ring-red-800'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">
              Nuevo Usuario
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Se enviará un email con la contraseña temporal
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
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Ej. Juan"
                className={fieldClass('firstName')}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Apellido *</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Ej. Pérez"
                className={fieldClass('lastName')}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ej. juan@chifa.com"
              className={fieldClass('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className={labelClass}>Rol *</label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setForm((p) => ({ ...p, role: opt.value }));
                    if (errors.role)
                      setErrors((p) => ({ ...p, role: undefined }));
                  }}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    form.role === opt.value
                      ? 'border-red-800 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p
                    className={`text-xs font-black ${form.role === opt.value ? 'text-red-800' : 'text-gray-700'}`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role}</p>
            )}
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
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
