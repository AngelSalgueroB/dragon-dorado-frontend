import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialOrders = [
  { id: "ORD-001", table: "04", waiter: "Admin_Chifa", time: "12 min", status: "warning", items: [{ qty: 2, name: "Arroz Chaufa Especial", note: "Sin cebolla" }] },
  { id: "ORD-002", table: "07", waiter: "Mozo_Juan", time: "25 min", status: "danger", items: [{ qty: 1, name: "Aeropuerto", note: "Bien frito" }] },
  { id: "ORD-003", table: "02", waiter: "Mozo_Ana", time: "2 min", status: "new", items: [{ qty: 3, name: "Tallarín Saltado", note: "" }] }
];

export default function KdsMonitor() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrders);
  const markAsReady = (id) => setOrders(orders.filter(order => order.id !== id));

  const getHeaderColor = (status) => {
    if (status === 'danger') return 'bg-red-600 text-white';
    if (status === 'warning') return 'bg-amber-400 text-amber-900';
    return 'bg-emerald-500 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans p-6">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg"><ChefHat size={32} className="text-gray-700" /></div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wider">KDS - Cocina</h1>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Dragon Dorado</p>
          </div>
        </div>
        <button onClick={() => navigate('/salon')} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg font-bold transition shadow-sm">
          Volver a Salón
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-300 flex flex-col h-full overflow-hidden">
            
            {/* Cabecera del Ticket */}
            <div className={`p-4 flex justify-between items-center ${getHeaderColor(order.status)}`}>
              <div>
                <h3 className="font-black text-xl">MESA {order.table}</h3>
                <p className="text-xs font-bold opacity-90">{order.waiter}</p>
              </div>
              <div className="flex items-center gap-1 font-black text-lg">
                {order.status === 'danger' ? <AlertTriangle size={20} /> : <Clock size={20} />}
                {order.time}
              </div>
            </div>

            {/* Platos */}
            <div className="p-5 flex-1 bg-yellow-50/30">
              <ul className="space-y-4">
                {order.items.map((item, idx) => (
                  <li key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex gap-3 text-gray-900 text-lg">
                      <span className="font-black text-chifa-red bg-red-50 px-2 rounded">x{item.qty}</span>
                      <span className="font-bold leading-tight">{item.name}</span>
                    </div>
                    {item.note && <p className="text-red-600 text-sm font-bold mt-2 ml-9 uppercase tracking-wide bg-red-50 p-1 rounded inline-block">⚠️ {item.note}</p>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Botón */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button onClick={() => markAsReady(order.id)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-lg flex justify-center items-center gap-2 text-xl transition-all uppercase tracking-widest shadow-sm">
                <CheckCircle size={24} /> Listo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}