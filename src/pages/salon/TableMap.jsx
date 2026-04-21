import React from 'react';
import { LayoutGrid, UserX, Info, Home } from 'lucide-react';
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
  disponible: "bg-emerald-500/20 border-emerald-500 text-emerald-500",
  ocupada: "bg-chifa-red/20 border-chifa-red text-chifa-red",
  reservada: "bg-blue-500/20 border-blue-500 text-blue-500",
  limpieza: "bg-amber-500/20 border-amber-500 text-amber-500",
};

export default function TableMap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-chifa-black p-6 font-sans">
      
      {/* Cabecera con botón de Dashboard */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-gray-800 hover:bg-chifa-gold hover:text-chifa-black rounded-lg transition-colors text-chifa-gold"
            title="Regresar al Dashboard"
          >
            <Home size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-chifa-gold uppercase tracking-tighter">Salón Principal</h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Estado de Mesas</p>
          </div>
        </div>
        
        <div className="hidden sm:flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Libre
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
            <div className="w-2 h-2 rounded-full bg-chifa-red"></div> Ocupada
          </div>
        </div>
      </header>

      {/* Grid de Mesas - Tamaño optimizado para captura */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-24 max-w-8xl mx-auto">
        {tablesData.map((table) => (
          <div 
            key={table.id}
            onClick={() => navigate('/comanda')}
            className={`aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${statusStyles[table.status]}`}
          >
            <span className="text-2xl font-black mb-1">{table.number}</span>
            <span className="text-[8px] uppercase font-bold tracking-widest opacity-80">{table.status}</span>
            <div className="mt-1 flex items-center gap-1 opacity-60">
              <UserX size={10} />
              <span className="text-[10px]">{table.capacity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Barra inferior */}
      <footer className="fixed bottom-6 left-6 right-6 bg-[#1e1e1e] border border-gray-800 rounded-2xl p-4 flex justify-between items-center shadow-2xl z-20">
        <div className="flex items-center gap-3">
          <Info className="text-chifa-gold" size={20} />
          <p className="text-sm text-gray-400 italic">Toque una mesa para iniciar pedido</p>
        </div>
        <button 
          onClick={() => navigate('/cocina')}
          className="bg-chifa-gold hover:bg-chifa-light text-chifa-black px-6 py-2 rounded-xl font-black text-xs uppercase transition-all shadow-lg"
        >
          Ver Cocina (KDS)
        </button>
      </footer>
    </div>
  );
}