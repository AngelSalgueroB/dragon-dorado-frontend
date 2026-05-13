import {
  AlertCircle,
  ArrowRight,
  ChefHat,
  CircleDollarSign,
  LayoutGrid,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary } from '../../actions/dashboard/get-dashboard-summary';
import { DashboardSummaryResponse } from '../../actions/dashboard/dashboard.interfaces';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState<DashboardSummaryResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await getDashboardSummary();
        setMetrics(response);
      } catch (error) {
        console.error("Error obteniendo métricas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const totalVentas = metrics 
    ? ((metrics.dineInTotal || 0) + (metrics.takeawayTotal || 0) + (metrics.deliveryTotal || 0))
    : 0;
  
  const [enteros, decimales] = totalVentas.toFixed(2).split('.');
  
  const mesasActivas = metrics?.dineInCount || 0;
  const pedidosCriticos = 0;

  const modules = [
    {
      name: 'Gestión de Salón',
      icon: <LayoutGrid size={32} />,
      path: '/salon',
      color: 'text-emerald-600',
      desc: 'Mapa de mesas y comandas.',
    },
    {
      name: 'Monitor de Cocina',
      icon: <ChefHat size={32} />,
      path: '/cocina',
      color: 'text-amber-500',
      desc: 'Control de pedidos (KDS).',
    },
    {
      name: 'Delivery',
      icon: <Truck size={32} />,
      path: '#',
      color: 'text-blue-600',
      desc: 'Seguimiento de pedidos.',
    },
    {
      name: 'Finanzas y Reportes',
      icon: <CircleDollarSign size={32} />,
      path: '#',
      color: 'text-yellow-600',
      desc: 'Cierre de caja y rentabilidad.',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-red-800"></div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
            Panel de <span className="text-red-800">Control</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
            Sesión iniciada:{' '}
            <span className="text-red-800 font-bold">Admin_Chifa</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-red-800 hover:text-white hover:border-red-800 px-5 py-2 rounded-lg font-bold text-xs transition-all uppercase shadow-sm"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Tarjeta de Ventas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-4 border-yellow-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Ventas del Día
            </span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <TrendingUp size={20} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">
            {loading ? '...' : `S/ ${enteros}`}
            <span className="text-xl text-gray-400">.{loading ? '00' : decimales}</span>
          </p>
        </div>

        {/* Tarjeta de Mesas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-4 border-emerald-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Mesas Activas
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Users size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">
            {loading ? '...' : mesasActivas < 10 ? `0${mesasActivas}` : mesasActivas} <span className="text-xl text-gray-400">/ 08</span>
          </p>
        </div>

        {/* Tarjeta Críticos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-4 border-red-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Pedidos Críticos
            </span>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle size={20} className="text-red-600 animate-pulse" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">
            {loading ? '...' : `0${pedidosCriticos}`}
          </p>
        </div>
      </div>

      {/* Módulos */}
      <h2 className="text-xs font-bold text-red-800 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-800 rounded-full"></span> Navegación por Módulos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, idx) => (
          <div
            key={idx}
            onClick={() => mod.path !== '#' && navigate(mod.path)}
            className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-red-800 hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`mb-5 transition-transform duration-300 group-hover:scale-110 ${mod.color}`}>
              {mod.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-red-800 transition-colors">
              {mod.name}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {mod.desc}
            </p>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 group-hover:text-red-800 transition-colors">
              Ingresar <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}