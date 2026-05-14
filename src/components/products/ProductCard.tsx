import { ImageOff, Pencil } from 'lucide-react';
import { ProductResponse } from '../../actions/products/products.interfaces';

interface ProductCardProps {
  product: ProductResponse;
  onEdit: (product: ProductResponse) => void;
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  return (
    <div
      className={`group bg-white rounded-2xl border-2 transition-all duration-200 hover:shadow-md overflow-hidden ${
        product.active
          ? 'border-gray-200 hover:border-red-300'
          : 'border-gray-200 opacity-60'
      }`}
    >
      {/* Image */}
      <div className="relative h-36 bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={28} className="text-gray-300" />
          </div>
        )}

        {/* Active badge */}
        {!product.active && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
              Inactivo
            </span>
          </div>
        )}

        {/* Edit button */}
        <button
          onClick={() => onEdit(product)}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 hover:text-red-800 transition-all opacity-0 group-hover:opacity-100"
          title="Editar producto"
        >
          <Pencil size={13} />
        </button>

        {/* Category badge */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {product.category.name}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-black text-gray-900 text-sm leading-tight truncate">
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-tight">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-black text-red-800">
            S/ {product.unitPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            #{product.id}
          </span>
        </div>
      </div>
    </div>
  );
}
