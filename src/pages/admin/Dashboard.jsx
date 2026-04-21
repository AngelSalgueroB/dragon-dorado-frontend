import React from 'react';
import { LayoutGrid, ChefHat, Truck, CircleDollarSign, TrendingUp, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const modules = [
    { name: "Gestión de Salón", icon: <LayoutGrid size={32} />, path: "/salon", color: "text-emerald-600", desc: "Mapa de mesas y comandas." },
    { name: "Monitor de Cocina", icon: <ChefHat size={32} />, path: "/cocina", color: "text-amber-500", desc: "Control de pedidos (KDS)." },
    { name: "Delivery", icon: <Truck size={32} />, path: "#", color: "text-blue-600", desc: "Seguimiento de pedidos." },
    { name: "Finanzas y Reportes", icon: <CircleDollarSign size={32} />, path: "#", color: "text-chifa-gold", desc: "Cierre de caja y rentabilidad." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800 font-sans selection:bg-chifa-red selection:text-white">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b border-gray-200 pb-5 relative">
        <div className="absolute bottom-[-1px] left-0 w-32 h-[3px] bg-chifa-red"></div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
            Panel de <span className="text-chifa-red">Control</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
            Sesión iniciada: <span className="text-chifa-red font-bold">Admin_Chifa</span>
          </p>
        </div>
        <button onClick={() => navigate('/')} className="bg-white border border-gray-300 text-gray-700 hover:bg-chifa-red hover:text-white hover:border-chifa-red px-5 py-2 rounded-lg font-bold text-xs transition-all uppercase shadow-sm">
          Cerrar Sesión
        </button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border shadow-sm border-4 border-chifa-gold">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ventas del Día</span>
            <div className="p-2 bg-yellow-50 rounded-lg"><TrendingUp size={20} className="text-yellow-600" /></div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">S/ 1,450<span className="text-xl text-gray-400">.50</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl border  shadow-sm border-4 border-emerald-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mesas Activas</span>
            <div className="p-2 bg-emerald-50 rounded-lg"><Users size={20} className="text-emerald-600" /></div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">05 <span className="text-xl text-gray-400">/ 08</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl border  shadow-sm border-4 border-chifa-red">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pedidos Críticos</span>
            <div className="p-2 bg-red-50 rounded-lg"><AlertCircle size={20} className="text-chifa-red animate-pulse" /></div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">03</p>
        </div>
      </div>

      {/* Módulos */}
      <h2 className="text-xs font-bold text-chifa-red uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-chifa-red rounded-full"></span> Navegación por Módulos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, idx) => (
          <div key={idx} onClick={() => mod.path !== "#" && navigate(mod.path)} className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-chifa-red hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1">
            <div className={`mb-5 transition-transform duration-300 group-hover:scale-110 ${mod.color}`}>{mod.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-chifa-red transition-colors">{mod.name}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{mod.desc}</p>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 group-hover:text-chifa-red transition-colors">
              Ingresar <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}