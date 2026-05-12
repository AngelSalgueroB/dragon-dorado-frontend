import { Pencil, Truck } from 'lucide-react';
import {
  DeliveryDriverResponse,
  DeliveryPlatform,
} from '../../actions/delivery-drivers/delivery-drivers.interface';

interface DriverTableProps {
  drivers: DeliveryDriverResponse[];
  loading: boolean;
  onEdit: (driver: DeliveryDriverResponse) => void;
}

const platformLabels: Record<
  DeliveryPlatform,
  { label: string; color: string }
> = {
  [DeliveryPlatform.UBER_EATS]: {
    label: 'Uber Eats',
    color: 'bg-green-100 text-green-700',
  },
  [DeliveryPlatform.RAPPI]: {
    label: 'Rappi',
    color: 'bg-orange-100 text-orange-700',
  },
  [DeliveryPlatform.PEDIDOS_YA]: {
    label: 'Pedidos Ya',
    color: 'bg-yellow-100 text-yellow-700',
  },
  [DeliveryPlatform.DIDI_FOOD]: {
    label: 'DiDi Food',
    color: 'bg-blue-100 text-blue-700',
  },
  [DeliveryPlatform.GLOVO]: {
    label: 'Glovo',
    color: 'bg-purple-100 text-purple-700',
  },
  [DeliveryPlatform.INTERNAL]: {
    label: 'Interno',
    color: 'bg-gray-100 text-gray-600',
  },
};

export default function DriverTable({
  drivers,
  loading,
  onEdit,
}: DriverTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-800 rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest font-bold">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Truck size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">
          Sin conductores registrados
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Agrega uno con el botón de arriba
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
              'Nombre',
              'Plataforma',
              'Teléfono',
              'Documento',
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
          {drivers.map((driver) => {
            const platform = platformLabels[driver.platform];
            return (
              <tr
                key={driver.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Nombre */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-800 font-black text-xs">
                        {driver.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {driver.name}
                    </span>
                  </div>
                </td>

                {/* Plataforma */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${platform.color}`}
                  >
                    {platform.label}
                  </span>
                </td>

                {/* Teléfono */}
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                  {driver.phoneNumber}
                </td>

                {/* Documento */}
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">
                    {driver.documentType}
                  </span>
                  <span className="text-gray-700 font-mono text-xs">
                    {driver.documentNumber}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      driver.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        driver.active ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                    {driver.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(driver)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-800 transition-all"
                    title="Editar conductor"
                  >
                    <Pencil size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
