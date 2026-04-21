import React from 'react';
import { 
  LayoutGrid, 
  ChefHat, 
  Truck,
  CircleDollarSign, 
  TrendingUp, 
  Users, 
  AlertCircle,
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // Módulos del sistema
  const modules = [
    { 
      name: "Gestión de Salón", 
      icon: <LayoutGrid size={32} />, 
      path: "/salon", 
      color: "text-emerald-500", 
      desc: "Mapa de mesas y comandas digitales." 
    },
    { 
      name: "Monitor de Cocina", 
      icon: <ChefHat size={32} />, 
      path: "/cocina", 
      color: "text-amber-500", 
      desc: "Control de pedidos (KDS) en tiempo real." 
    },
    { 
      name: "Delivery", 
      icon: <Truck size={32} />, 
      path: "#", 
      color: "text-blue-500", 
      desc: "Seguimiento de pedidos externos." 
    },
    { 
      name: "Finanzas y Reportes", 
      icon: <CircleDollarSign size={32} />, 
      path: "#", 
      color: "text-chifa-gold", 
      desc: "Cierre de caja y rentabilidad." 
    },
  ];

  return (
    <div className="min-h-screen bg-chifa-black p-6 text-white font-sans selection:bg-chifa-red selection:text-white">
      
      {/* Header con identidad visual corporativa (Acento Rojo) */}
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-5 relative">
        {/* Línea decorativa roja en la base del header */}
        <div className="absolute bottom-[-1px] left-0 w-32 h-[2px] bg-chifa-red shadow-[0_0_10px_#b30000]"></div>
        
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Panel de <span className="text-chifa-red">Control</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
            Sesión iniciada: <span className="text-chifa-gold font-bold">Admin_Chifa</span>
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-chifa-red/10 border border-chifa-red text-chifa-red hover:bg-chifa-red hover:text-white px-5 py-2 rounded-lg font-bold text-xs transition-all duration-300 uppercase shadow-[0_0_10px_rgba(179,0,0,0.2)] hover:shadow-[0_0_20px_rgba(179,0,0,0.6)]"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Resumen de KPIs (Sin borde izquierdo, con línea superior sutil) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* KPI 1 */}
        <div className="relative bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-xl overflow-hidden group hover:border-gray-600 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-chifa-gold"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ventas del Día</span>
            <div className="p-2 bg-chifa-gold/10 rounded-lg">
              <TrendingUp size={20} className="text-chifa-gold" />
            </div>
          </div>
          <p className="text-4xl font-black text-white tracking-tight">S/ 1,450<span className="text-xl text-gray-500">.50</span></p>
        </div>

        {/* KPI 2 */}
        <div className="relative bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-xl overflow-hidden group hover:border-gray-600 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-emerald-500"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mesas Activas</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Users size={20} className="text-emerald-500" />
            </div>
          </div>
          <p className="text-4xl font-black text-white tracking-tight">05 <span className="text-xl text-gray-500">/ 08</span></p>
        </div>

        {/* KPI 3 */}
        <div className="relative bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-xl overflow-hidden group hover:border-chifa-red transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-chifa-red to-chifa-dark"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pedidos Críticos</span>
            <div className="p-2 bg-chifa-red/10 rounded-lg">
              <AlertCircle size={20} className="text-chifa-red animate-pulse" />
            </div>
          </div>
          <p className="text-4xl font-black text-white tracking-tight">03</p>
        </div>
      </div>

      {/* Acceso a Módulos del Sistema */}
      <h2 className="text-xs font-bold text-chifa-red uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-chifa-red rounded-full"></span> Navegación por Módulos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, idx) => (
          <div 
            key={idx}
            onClick={() => mod.path !== "#" && navigate(mod.path)}
            className="group bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-chifa-red cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(179,0,0,0.15)] relative overflow-hidden"
          >
            {/* Brillo de fondo al hacer hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-chifa-red/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>

            <div className={`mb-5 transition-transform duration-300 group-hover:scale-110 ${mod.color}`}>
              {mod.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-chifa-red transition-colors">{mod.name}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{mod.desc}</p>
            
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-600 group-hover:text-chifa-gold transition-colors">
              Ingresar <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}