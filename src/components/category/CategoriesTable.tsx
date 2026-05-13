import { Pencil, Shapes } from 'lucide-react';
import { CategoryResponse } from '../../actions/category/category.interfaces';

interface CategoriesTableProps {
  categories: CategoryResponse[];
  loading: boolean;
  onEdit: (category: CategoryResponse) => void;
}

export default function CategoriesTable({
  categories,
  loading,
  onEdit,
}: CategoriesTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-800 rounded-full animate-spin" />

          <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Shapes size={40} className="mb-3 text-gray-300" />

        <p className="text-sm font-semibold text-gray-500">
          Sin categorías registradas
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Agrega una con el botón de arriba
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {['Categoría', 'Descripción', ''].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Categoria */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-800 font-black text-xs">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {category.name}
                    </p>

                    <p className="text-[11px] text-gray-400 font-mono">
                      ID #{category.id}
                    </p>
                  </div>
                </div>
              </td>

              {/* Descripcion */}
              <td className="px-4 py-3 text-gray-500 text-sm max-w-md">
                {category.description || (
                  <span className="text-gray-300">—</span>
                )}
              </td>

              {/* Action */}
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(category)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-800 transition-all"
                  title="Editar categoría"
                >
                  <Pencil size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
