import React, { useState } from 'react';
import { ArrowLeft, ChefHat, Plus, Minus, Trash2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const menuData = [
  { id: 1, name: "Arroz Chaufa Especial", price: 25.00, category: "Platos Fuertes" },
  { id: 2, name: "Tallarín Saltado de Pollo", price: 22.00, category: "Platos Fuertes" },
  { id: 3, name: "Sopa Wantán", price: 15.00, category: "Entradas" },
  { id: 4, name: "Aeropuerto", price: 28.00, category: "Platos Fuertes" },
  { id: 5, name: "Chijaukay", price: 26.00, category: "Especialidades" },
  { id: 6, name: "Tipakay", price: 26.00, category: "Especialidades" },
  { id: 7, name: "Inca Kola 1L", price: 10.00, category: "Bebidas" },
  { id: 8, name: "Chicha Morada Jarra", price: 15.00, category: "Bebidas" },
];

export default function TakeOrder() {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState("");

  const addItem = (item) => {
    const existing = orderItems.find(i => i.id === item.id);
    if (existing) {
      setOrderItems(orderItems.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setOrderItems([...orderItems, { ...item, qty: 1 }]);
    }
  };

  const removeItem = (id) => {
    setOrderItems(orderItems.filter(i => i.id !== id));
  };

  const total = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#1a1a1a] font-sans text-white">
      
      {/* Lado Izquierdo: Menú */}
      <div className="w-full md:w-2/3 p-6 flex flex-col h-screen overflow-hidden">
        <header className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
          <button onClick={() => navigate('/salon')} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
            <ArrowLeft size={20} className="text-[#d4af37]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#d4af37] uppercase tracking-wide">Mesa 04</h1>
            <p className="text-sm text-gray-400">Mozo: Admin_Chifa</p>
          </div>
        </header>

        {/* Categorías (Filtros visuales) */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {["Todos", "Entradas", "Platos Fuertes", "Especialidades", "Bebidas"].map(cat => (
            <button key={cat} className="px-4 py-2 bg-gray-800 hover:bg-[#b30000] rounded-full text-sm font-semibold whitespace-nowrap transition-colors">
              {cat}
            </button>
          ))}
        </div>

        {/* Cuadrícula de Platos */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {menuData.map(item => (
            <div 
              key={item.id} 
              onClick={() => addItem(item)}
              className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 hover:border-[#d4af37] cursor-pointer transition-all hover:-translate-y-1"
            >
              <h3 className="font-bold text-sm mb-2">{item.name}</h3>
              <p className="text-[#d4af37] font-black">S/ {item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lado Derecho: Resumen de Comanda */}
      <div className="w-full md:w-1/3 bg-[#2a2a2a] border-l border-gray-800 flex flex-col h-screen">
        <div className="p-6 bg-[#1e1e1e] border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <ChefHat className="text-[#d4af37]" /> Comanda
          </h2>
          <span className="bg-[#b30000] text-white text-xs px-2 py-1 rounded font-bold">{orderItems.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10 text-sm">Seleccione platos del menú para armar la comanda.</p>
          ) : (
            orderItems.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                <div className="flex-1">
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-[#d4af37]">S/ {(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black bg-gray-800 px-2 rounded">x{item.qty}</span>
                  <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-[#b30000] transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sección Inferior: Notas y Envío */}
        <div className="p-6 bg-[#1e1e1e] border-t border-gray-800">
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">Notas a Cocina (Opcional)</label>
            <input 
              type="text" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Sin cebolla china, bien frito..." 
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 font-bold uppercase">Total</span>
            <span className="text-2xl font-black text-[#d4af37]">S/ {total.toFixed(2)}</span>
          </div>
          <button 
            disabled={orderItems.length === 0}
            className="w-full bg-[#d4af37] hover:bg-[#f1c40f] text-[#1a1a1a] font-black py-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} /> ENVIAR A COCINA
          </button>
        </div>
      </div>

    </div>
  );
}