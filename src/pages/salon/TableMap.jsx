import React from 'react';
import { UserX, Info, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tablesData = [
  { id: 1, number: "01", status: "disponible", capacity: 4 },
  { id: 2, number: "02", status: "ocupada", capacity: 2 },
  { id: 3, number: "03", status: "limpieza", capacity: 6 },
  { id: 4, number: "04", status: "disponible", capacity: 4 },
  { id: 5, number: "05", status: "reservada", capacity: 8 },
  { id: 6, number: "06", status: "ocupada", capacity: 4 },
  { id: 7, number: "07", status: "disponible", capacity: 2 },
  { id: 8, number: "08", status: "disponible", capacity: 4 },
];

const statusStyles = {
  disponible: "bg-emerald-50 border-emerald-500 text-emerald-700",
  ocupada: "bg-red-50 border-chifa-red text-chifa-red",
  reservada: "bg-blue-50 border-blue-500 text-blue-700",
  limpieza: "bg-amber-50 border-amber-500 text-amber-700",
};

export default function TableMap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 shadow-sm">
            <Home size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tighter">Salón Principal</h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Estado de Mesas</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-24 max-w-6xl mx-auto">
        {tablesData.map((table) => (
          <div key={table.id} onClick={() => navigate('/comanda')} className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-sm bg-white ${statusStyles[table.status]}`}>
            <span className="text-2xl font-black mb-1">{table.number}</span>
            <span className="text-[8px] uppercase font-bold tracking-widest opacity-80">{table.status}</span>
            <div className="mt-1 flex items-center gap-1 opacity-60">
              <UserX size={10} />
              <span className="text-[10px] font-bold">{table.capacity}</span>
            </div>
          </div>
        ))}
      </div>

      <footer className="fixed bottom-6 left-6 right-6 bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-lg z-20">
        <div className="flex items-center gap-3 text-gray-600">
          <Info className="text-blue-500" size={20} />
          <p className="text-sm italic font-medium">Toque una mesa para iniciar pedido</p>
        </div>
        <button onClick={() => navigate('/cocina')} className="bg-chifa-red hover:bg-red-800 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase transition-all shadow-md">
          Ver Cocina (KDS)
        </button>
      </footer>
    </div>
  );
}