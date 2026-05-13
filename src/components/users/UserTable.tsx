import { Power } from 'lucide-react';
import { Role, UserResponse } from '../../actions/users/users.interfaces';

interface UserTableProps {
  users: UserResponse[];
  loading: boolean;
  onToggleActive: (user: UserResponse) => void;
}

const roleConfig: Record<Role, { label: string; color: string }> = {
  [Role.ADMIN]: { label: 'Admin', color: 'bg-red-100 text-red-700' },
  [Role.MANAGER]: { label: 'Gerente', color: 'bg-purple-100 text-purple-700' },
  [Role.WAITER]: { label: 'Mesero', color: 'bg-blue-100 text-blue-700' },
  [Role.CASHIER]: { label: 'Cajero', color: 'bg-yellow-100 text-yellow-700' },
  [Role.KITCHEN]: { label: 'Cocina', color: 'bg-orange-100 text-orange-700' },
};

const avatarColor: Record<Role, string> = {
  [Role.ADMIN]: 'bg-red-50 border-red-100 text-red-800',
  [Role.MANAGER]: 'bg-purple-50 border-purple-100 text-purple-800',
  [Role.WAITER]: 'bg-blue-50 border-blue-100 text-blue-800',
  [Role.CASHIER]: 'bg-yellow-50 border-yellow-100 text-yellow-800',
  [Role.KITCHEN]: 'bg-orange-50 border-orange-100 text-orange-800',
};

export default function UserTable({
  users,
  loading,
  onToggleActive,
}: UserTableProps) {
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

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Power size={20} className="text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-500">
          Sin usuarios registrados
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Crea uno con el botón de arriba
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {['Usuario', 'Nombre', 'Email', 'Rol', 'Estado', 'Desde', ''].map(
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
          {users.map((user) => {
            const role = roleConfig[user.role];
            return (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Usuario */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${avatarColor[user.role]}`}
                    >
                      <span className="font-black text-xs">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-gray-600">
                      {user.username}
                    </span>
                  </div>
                </td>

                {/* Nombre */}
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {user.email}
                </td>

                {/* Rol */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${role.color}`}
                  >
                    {role.label}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      user.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-gray-400'}`}
                    />
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* Fecha */}
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>

                {/* Acción */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onToggleActive(user)}
                    title={
                      user.active ? 'Desactivar usuario' : 'Activar usuario'
                    }
                    className={`p-1.5 rounded-lg transition-all ${
                      user.active
                        ? 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                        : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <Power size={15} />
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
