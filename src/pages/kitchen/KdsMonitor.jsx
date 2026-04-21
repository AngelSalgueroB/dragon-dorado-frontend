import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Datos simulados de pedidos llegando a cocina
const initialOrders = [
  {
    id: "ORD-001",
    table: "04",
    waiter: "Admin_Chifa",
    time: "12 min",
    status: "warning", 
    items: [
      { qty: 2, name: "Arroz Chaufa Especial", note: "Sin cebolla china" },
      { qty: 1, name: "Sopa Wantán", note: "" }
    ]
  },
  {
    id: "ORD-002",
    table: "07",
    waiter: "Mozo_Juan",
    time: "25 min",
    status: "danger", // red (demorado)
    items: [
      { qty: 1, name: "Aeropuerto", note: "Bien frito" },
      { qty: 1, name: "Chijaukay", note: "" }
    ]
  },
  {
    id: "ORD-003",
    table: "02",
    waiter: "Mozo_Ana",
    time: "2 min",
    status: "new", // green
    items: [
      { qty: 3, name: "Tallarín Saltado de Pollo", note: "" }
    ]
  }
];

export default function KdsMonitor() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrders);

  // Función para marcar un pedido como listo y quitarlo de la pantalla
  const markAsReady = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const getBorderColor = (status) => {
    if (status === 'danger') return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    if (status === 'warning') return 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
  };

  const getHeaderColor = (status) => {
    if (status === 'danger') return 'bg-red-500 text-white';
    if (status === 'warning') return 'bg-amber-500 text-black';
    return 'bg-emerald-500 text-black';
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans p-6">
      
      {/* Cabecera del KDS */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <ChefHat size={32} className="text-[#d4af37]" />
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">KDS - Cocina</h1>
            <p className="text-[#d4af37] text-sm font-bold tracking-widest uppercase">Dragon Dorado</p>
          </div>
        </div>
        
        {/* Botón para volver al mapa */}
        <button 
          onClick={() => navigate('/salon')}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold transition"
        >
          Volver a Salón
        </button>
      </header>

      {/* Grid de Tickets de Pedido*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-500 mt-20">
            <CheckCircle size={64} className="mb-4 text-gray-700" />
            <h2 className="text-2xl font-bold uppercase">No hay pedidos pendientes</h2>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className={`bg-[#1e1e1e] rounded-xl border-2 flex flex-col h-full ${getBorderColor(order.status)}`}>
              
              {/* Cabecera del Ticket */}
              <div className={`p-4 rounded-t-lg flex justify-between items-center ${getHeaderColor(order.status)}`}>
                <div>
                  <h3 className="font-black text-xl">MESA {order.table}</h3>
                  <p className="text-xs font-bold opacity-80">{order.waiter}</p>
                </div>
                <div className="flex items-center gap-1 font-black text-lg">
                  {order.status === 'danger' ? <AlertTriangle size={20} /> : <Clock size={20} />}
                  {order.time}
                </div>
              </div>

              {/* Lista de Platos */}
              <div className="p-4 flex-1 overflow-y-auto">
                <ul className="space-y-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="border-b border-gray-800 pb-3 last:border-0">
                      <div className="flex gap-3 text-white text-lg">
                        <span className="font-black text-[#d4af37]">x{item.qty}</span>
                        <span className="font-bold leading-tight">{item.name}</span>
                      </div>
                      {item.note && (
                        <p className="text-red-400 text-sm font-bold mt-1 ml-7 uppercase tracking-wide">
                          *** {item.note} ***
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón de Acción (Grande como pide el SRS) */}
              <div className="p-4 border-t border-gray-800 bg-[#121212] rounded-b-xl">
                <button 
                  onClick={() => markAsReady(order.id)}
                  className="w-full bg-[#1e1e1e] hover:bg-emerald-600 border border-emerald-600 text-emerald-500 hover:text-white font-black py-4 rounded-lg flex justify-center items-center gap-2 text-xl transition-all uppercase tracking-widest"
                >
                  <CheckCircle size={24} /> Listo para servir
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}