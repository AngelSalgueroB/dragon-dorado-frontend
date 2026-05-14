import { AlertTriangle, LockKeyhole, X } from 'lucide-react';
import { useState } from 'react';
import { CashRegisterResponse } from '../../actions/cash-register/cash-register.interfaces';
import { closeCashRegister } from '../../actions/cash-register/close-cash-register';

interface CloseCashRegisterModalProps {
  register: CashRegisterResponse;
  onClose: () => void;
  onSuccess: () => void;
}

const fmt = (date: string) =>
  new Date(date).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function CloseCashRegisterModal({
  register,
  onClose,
  onSuccess,
}: CloseCashRegisterModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await closeCashRegister(register.id);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">
              Cerrar Caja
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Confirma el cierre del turno
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-gray-500 font-semibold">
                Cajero
              </span>
              <span className="text-xs font-black text-gray-900">
                {register.user.fullName}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-gray-500 font-semibold">
                Apertura
              </span>
              <span className="text-xs text-gray-700 font-mono">
                {fmt(register.openingTime)}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-gray-500 font-semibold">
                Monto inicial
              </span>
              <span className="text-sm font-black text-gray-900 font-mono">
                S/ {register.openingAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-gray-500 font-semibold">
                Cierre (ahora)
              </span>
              <span className="text-xs text-gray-700 font-mono">
                {new Date().toLocaleString('es-PE', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle
              size={15}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700 leading-relaxed">
              Esta acción no puede deshacerse. El monto de cierre será calculado
              por el sistema.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-800 text-white text-sm font-black uppercase tracking-wide hover:bg-red-900 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              <LockKeyhole size={14} />
              {loading ? 'Cerrando...' : 'Cerrar Caja'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
