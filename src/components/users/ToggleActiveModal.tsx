import { AlertTriangle, Power } from 'lucide-react';
import { useState } from 'react';
import { UserResponse } from '../../actions/users/users.interfaces';
import { updateUserActiveStatus } from '../../actions/users/update-user-active-status';

interface ToggleActiveModalProps {
  user: UserResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ToggleActiveModal({
  user,
  onClose,
  onSuccess,
}: ToggleActiveModalProps) {
  const [loading, setLoading] = useState(false);
  const isActivating = !user.active;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await updateUserActiveStatus(user.id, { active: !user.active });
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="p-6 text-center">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isActivating ? 'bg-emerald-50' : 'bg-red-50'
            }`}
          >
            {isActivating ? (
              <Power size={22} className="text-emerald-600" />
            ) : (
              <AlertTriangle size={22} className="text-red-600" />
            )}
          </div>

          <h2 className="font-black text-gray-900 text-base uppercase tracking-tight mb-1">
            {isActivating ? 'Activar usuario' : 'Desactivar usuario'}
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            ¿Confirmas que deseas {isActivating ? 'activar' : 'desactivar'} a:
          </p>
          <p className="font-black text-gray-900 text-sm mb-1">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-400 font-mono mb-5">
            {user.username}
          </p>

          {!isActivating && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-5">
              El usuario no podrá iniciar sesión mientras esté inactivo.
            </p>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-black uppercase tracking-wide disabled:opacity-60 transition-all ${
              isActivating
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-red-800 hover:bg-red-900'
            }`}
          >
            {loading ? 'Guardando...' : isActivating ? 'Activar' : 'Desactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}
