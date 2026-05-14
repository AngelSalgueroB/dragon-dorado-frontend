import { LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import {
  CashRegisterResponse,
  CashRegisterStatus,
} from '../../actions/cash-register/cash-register.interfaces';

interface CashRegisterTableProps {
  registers: CashRegisterResponse[];
  loading: boolean;
  onClose: (register: CashRegisterResponse) => void;
}

const fmt = (date: string) =>
  new Date(date).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const money = (amount?: number) =>
  amount !== null ? `S/ ${amount?.toFixed(2)}` : '—';

export default function CashRegisterTable({
  registers,
  loading,
  onClose,
}: CashRegisterTableProps) {
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

  if (registers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <LockKeyholeOpen size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">
          Sin registros de caja
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Abre una caja para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {[
              '#',
              'Cajero',
              'Apertura',
              'Cierre',
              'Monto Apertura',
              'Monto Cierre',
              'Estado',
              '',
            ].map((h) => (
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
          {registers.map((reg) => {
            const isOpen = reg.status === CashRegisterStatus.OPEN;
            const diff =
              reg.closingAmount !== undefined
                ? reg.closingAmount - reg.openingAmount
                : undefined;

            return (
              <tr
                key={reg.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* ID */}
                <td className="px-4 py-3 text-xs font-mono text-gray-400">
                  #{reg.id}
                </td>

                {/* Cajero */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-800 font-black text-[10px]">
                        {reg.user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 text-xs">
                      {reg.user.fullName}
                    </span>
                  </div>
                </td>

                {/* Apertura */}
                <td className="px-4 py-3 text-xs text-gray-500">
                  {fmt(reg.openingTime)}
                </td>

                {/* Cierre */}
                <td className="px-4 py-3 text-xs text-gray-500">
                  {reg.closingTime ? (
                    fmt(reg.closingTime)
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                {/* Monto apertura */}
                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                  {money(reg.openingAmount)}
                </td>

                {/* Monto cierre */}
                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                  {money(reg.closingAmount)}
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isOpen
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                      }`}
                    />
                    {isOpen ? 'Abierta' : 'Cerrada'}
                  </span>
                </td>

                {/* Acción */}
                <td className="px-4 py-3 text-right">
                  {isOpen && (
                    <button
                      onClick={() => onClose(reg)}
                      title="Cerrar caja"
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-800 transition-all"
                    >
                      <LockKeyhole size={15} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
