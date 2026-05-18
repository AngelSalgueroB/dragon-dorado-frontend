import {
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cpu,
  History,
  LayoutGrid,
  Package,
  Tag,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
  section: string;
}

const navItems: NavItem[] = [
  {
    label: 'Pedidos',
    icon: <ClipboardList size={18} />,
    path: '/pedidos',
    section: 'Operaciones',
  },
  {
    label: 'Usuarios',
    icon: <Users size={18} />,
    path: '/usuarios',
    section: 'Gestión',
  },
  {
    label: 'Clientes',
    icon: <Box size={18} />,
    path: '/clientes',
    section: 'Gestión',
  },
  {
    label: 'Conductores',
    icon: <Truck size={18} />,
    path: '/conductores',
    section: 'Gestión',
  },
  {
    label: 'Mesas',
    icon: <LayoutGrid size={18} />,
    path: '/mesas',
    section: 'Salón',
  },
  {
    label: 'Órdenes',
    icon: <History size={18} />,
    path: '/ordenes',
    section: 'Salón',
  },
  {
    label: 'Categorías',
    icon: <Tag size={18} />,
    path: '/categorias',
    section: 'Catálogo',
  },
  {
    label: 'Productos',
    icon: <Package size={18} />,
    path: '/productos',
    section: 'Catálogo',
  },
  {
    label: 'Registros de Caja',
    icon: <Wallet size={18} />,
    path: '/caja',
    section: 'Finanzas',
  },
];

const sections = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
  if (!acc[item.section]) acc[item.section] = [];
  acc[item.section].push(item);
  return acc;
}, {});

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`relative flex flex-col min-h-screen bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* Logo */}
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        title="Ir al dashboard"
        className={`relative flex items-center min-h-[72px] border-b border-gray-200 w-full text-left transition-colors hover:bg-gray-50 cursor-pointer ${
          collapsed ? 'justify-center' : 'gap-3 px-5'
        }`}
      >
        <div
          className={`absolute bottom-[-1px] left-0 h-[3px] bg-red-800 transition-all duration-300 ${
            collapsed ? 'w-0' : 'w-20'
          }`}
        />
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-800 flex items-center justify-center">
          <Cpu size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-black text-[13px] text-gray-900 uppercase tracking-tight leading-tight">
              Chifa
            </p>
            <p className="text-[10px] text-red-800 font-bold uppercase tracking-[0.15em]">
              Sistema POS
            </p>
          </div>
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="mb-1">
            {!collapsed ? (
              <p className="flex items-center gap-1.5 px-5 pt-2.5 pb-1 text-[9px] font-black text-red-800 uppercase tracking-[0.25em]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-800 flex-shrink-0" />
                {section}
              </p>
            ) : (
              <div className="h-px bg-gray-100 mx-3 my-1.5" />
            )}

            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 transition-all duration-150 ${
                    collapsed
                      ? 'justify-center py-2.5'
                      : 'px-5 py-2 mr-2 rounded-r-lg border-l-[3px]'
                  } ${
                    isActive
                      ? 'bg-red-50 text-red-800 border-red-800'
                      : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span
                      className={`text-[13px] ${isActive ? 'font-bold' : 'font-medium'}`}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div
        className={`border-t border-gray-200 p-3 flex ${
          collapsed ? 'justify-center' : 'justify-end'
        }`}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:bg-red-800 hover:text-white hover:border-red-800 transition-all duration-150 cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
