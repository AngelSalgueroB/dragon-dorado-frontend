import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  ProductCategoryResponse,
  ProductResponse,
  UpdateProductRequest,
} from '../../actions/products/products.interfaces';
import { updateProduct } from '../../actions/products/update-product';
import { updateProductImage } from '../../actions/products/update-product-image';

interface EditProductModalProps {
  product: ProductResponse;
  categories: ProductCategoryResponse[];
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass =
  'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400';
const labelClass =
  'block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1';

interface FormErrors {
  name?: string;
  unitPrice?: string;
  categoryId?: string;
  image?: string;
}

export default function EditProductModal({
  product,
  categories,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const [form, setForm] = useState<UpdateProductRequest>({
    name: product.name,
    description: product.description ?? '',
    unitPrice: product.unitPrice,
    categoryId: product.category.id,
    active: product.active,
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    else if (form.name.trim().length < 2)
      newErrors.name = 'Mínimo 2 caracteres';
    if (!form.unitPrice || form.unitPrice <= 0)
      newErrors.unitPrice = 'El precio debe ser mayor a 0';
    if (!form.categoryId) newErrors.categoryId = 'Selecciona una categoría';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        image: 'El archivo debe ser una imagen',
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'La imagen no debe superar 5MB',
      }));
      return;
    }
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await updateProduct(product.id, {
        name: form.name.trim(),
        unitPrice: form.unitPrice,
        categoryId: form.categoryId,
        active: form.active,
        ...(form.description?.trim() && {
          description: form.description.trim(),
        }),
      });
      if (newImage) {
        await updateProductImage(product.id, newImage);
      }
      onSuccess();
    } catch {
      // Handled globally by apiClient interceptor
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: keyof FormErrors) =>
    `${inputClass} ${errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-red-800 focus:ring-red-800'}`;

  const currentImage = imagePreview ?? product.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">
              Editar Producto
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[260px]">
              {product.name}
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
          {/* Image */}
          <div>
            <label className={labelClass}>Imagen del producto</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-200 hover:border-red-800 transition-all overflow-hidden h-40"
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                  <ImagePlus size={24} />
                  <span className="text-xs font-semibold">Sin imagen</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <ImagePlus size={16} />
                  Cambiar imagen
                </div>
              </div>
              {newImage && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  Nueva imagen
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

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

          {/* Descripción */}
          <div>
            <label className={labelClass}>
              Descripción{' '}
              <span className="text-gray-300 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <textarea
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              rows={2}
              className={`${inputClass} border-gray-200 focus:border-red-800 focus:ring-red-800 resize-none`}
            />
          </div>

          {/* Precio + Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Precio (S/) *</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                min={0}
                step={0.5}
                className={fieldClass('unitPrice')}
              />
              {errors.unitPrice && (
                <p className="text-xs text-red-500 mt-1">{errors.unitPrice}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Categoría *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className={fieldClass('categoryId')}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>
              )}
            </div>
          </div>

          {/* Activo toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-700">
                Estado del producto
              </p>
              <p className="text-xs text-gray-400">
                {form.active ? 'Visible en carta' : 'Oculto de la carta'}
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
