import { Pencil, Users } from 'lucide-react';
import { ClientResponse } from '../../actions/clients/clients.interfaces';
import { DocumentType } from '../../actions/common';

interface ClientTableProps {
  clients: ClientResponse[];
  loading: boolean;
  onEdit: (client: ClientResponse) => void;
}

const docTypeLabel: Record<DocumentType, string> = {
  [DocumentType.DNI]: 'DNI',
  [DocumentType.RUC]: 'RUC',
};

export default function ClientTable({
  clients,
  loading,
  onEdit,
}: ClientTableProps) {
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

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Users size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">
          Sin clientes registrados
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
            {['Cliente', 'Documento', 'Teléfono', 'Email', 'Estado', ''].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Cliente */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-800 font-black text-xs">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {client.name}
                  </span>
                </div>
              </td>

              {/* Documento */}
              <td className="px-4 py-3">
                {client.documentNumber ? (
                  <>
                    <span className="text-[10px] font-black text-gray-400 uppercase mr-1">
                      {client.documentType
                        ? docTypeLabel[client.documentType]
                        : ''}
                    </span>
                    <span className="text-gray-700 font-mono text-xs">
                      {client.documentNumber}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
              </td>

              {/* Teléfono */}
              <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                {client.phoneNumber}
              </td>

              {/* Email */}
              <td className="px-4 py-3 text-gray-500 text-xs">
                {client.email || <span className="text-gray-300">—</span>}
              </td>

              {/* Estado */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    client.active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${client.active ? 'bg-emerald-500' : 'bg-gray-400'}`}
                  />
                  {client.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>

              {/* Acción */}
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(client)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-800 transition-all"
                  title="Editar cliente"
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
