import { X } from 'lucide-react';
import { ChangeEvent, SubmitEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  CategoryResponse,
  UpdateCategoryRequest,
} from '../../actions/category/category.interfaces';
import { updateCategory } from '../../actions/category/update-category';

interface EditCategoryModalProps {
  category: CategoryResponse;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  description?: string;
}

const inputClass =
  'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400';

const labelClass =
  'block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1';

export default function EditCategoryModal({
  category,
  onClose,
  onSuccess,
}: EditCategoryModalProps) {
  const [form, setForm] = useState<UpdateCategoryRequest>({
    name: category.name,
    description: category.description,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: category.name,
      description: category.description,
    });

    setErrors({});
  }, [category]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Debe tener al menos 3 caracteres';
    }

    if (!form.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (form.description.trim().length < 5) {
      newErrors.description = 'Debe tener al menos 5 caracteres';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await updateCategory(category.id, {
        name: form.name.trim(),
        description: form.description.trim(),
      });

      toast.success('Categoría actualizada exitosamente');

      onSuccess();
    } catch {
      // handled globally
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
              Editar Categoría
            </h2>

            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
              {category.name}
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
            <label className={labelClass}>Nombre *</label>

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

          {/* Descripcion */}
          <div>
            <label className={labelClass}>Descripción *</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={`${fieldClass('description')} resize-none`}
            />

            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
