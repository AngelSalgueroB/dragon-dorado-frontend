import { Wallet, X } from 'lucide-react';
import { SubmitEvent, useState } from 'react';
import { createCashRegister } from '../../actions/cash-register/create-cash-register';

interface OpenCashRegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function OpenCashRegisterModal({
  onClose,
  onSuccess,
}: OpenCashRegisterModalProps) {
  const [openingAmount, setOpeningAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const value = Number(openingAmount);
    if (openingAmount === '' || isNaN(value)) {
      setError('Ingresa el monto de apertura');
      return false;
    }
    if (value < 0) {
      setError('El monto no puede ser negativo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createCashRegister(Number(openingAmount));
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
              Abrir Caja
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Ingresa el fondo inicial
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
          {/* Monto */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1">
              Monto de apertura (S/) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                S/
              </span>
              <input
                type="number"
                step="0.01"
                value={openingAmount}
                onChange={(e) => {
                  setOpeningAmount(e.target.value);
                  if (error) setError(null);
                }}
                min={0}
                placeholder="0.00"
                className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-gray-900 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 text-right font-mono text-lg font-bold ${
                  error
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-red-800 focus:ring-red-800'
                }`}
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Info */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Wallet size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Este monto representa el efectivo disponible al inicio del turno.
              Se registrará con tu usuario y la hora actual.
            </p>
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
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-black uppercase tracking-wide hover:bg-emerald-700 disabled:opacity-60 transition-all"
            >
              {loading ? 'Abriendo...' : 'Abrir Caja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
