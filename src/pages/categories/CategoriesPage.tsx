import { Plus, Shapes } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CategoryResponse } from '../../actions/category/category.interfaces';
import { getCategories } from '../../actions/category/get-categories';
import CategoriesTable from '../../components/category/CategoriesTable';
import CreateCategoryModal from '../../components/category/CreateCategoryModal';
import EditCategoryModal from '../../components/category/EditCategoryModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const data = await getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSuccess = () => {
    setShowCreate(false);
    setEditingCategory(null);

    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-start mb-8 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-red-800" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center flex-shrink-0">
            <Shapes size={20} className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Gestión de <span className="text-red-800">Categorías</span>
            </h1>

            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              {loading ? '...' : `${categories.length} categorías registradas`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} />
          Nueva Categoría
        </button>
      </header>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <CategoriesTable
          categories={categories}
          loading={loading}
          onEdit={setEditingCategory}
        />
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateCategoryModal
          onClose={() => setShowCreate(false)}
          onSuccess={handleSuccess}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
