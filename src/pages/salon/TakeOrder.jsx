import React, { useState } from 'react';
import { ArrowLeft, ChefHat, Trash2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const menuData = [
  { id: 1, name: "Arroz Chaufa Especial", price: 25.00, category: "Platos Fuertes" },
  { id: 2, name: "Tallarín Saltado de Pollo", price: 22.00, category: "Platos Fuertes" },
  { id: 3, name: "Sopa Wantán", price: 15.00, category: "Entradas" },
  { id: 4, name: "Aeropuerto", price: 28.00, category: "Platos Fuertes" },
  { id: 5, name: "Chijaukay", price: 26.00, category: "Especialidades" },
  { id: 6, name: "Tipakay", price: 26.00, category: "Especialidades" },
];

export default function TakeOrder() {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState("");

  const addItem = (item) => {
    const existing = orderItems.find(i => i.id === item.id);
    if (existing) setOrderItems(orderItems.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    else setOrderItems([...orderItems, { ...item, qty: 1 }]);
  };
  const removeItem = (id) => setOrderItems(orderItems.filter(i => i.id !== id));
  const total = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* Menú Izquierdo */}
      <div className="w-full md:w-2/3 p-6 flex flex-col h-screen overflow-hidden">
        <header className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-300">
          <button onClick={() => navigate('/salon')} className="p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 shadow-sm">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase">Mesa 04</h1>
            <p className="text-sm text-gray-500 font-medium">Mozo: Admin_Chifa</p>
          </div>
        </header>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {["Todos", "Entradas", "Platos Fuertes", "Especialidades", "Bebidas"].map(cat => (
            <button key={cat} className="px-5 py-2 bg-white border border-gray-200 hover:border-chifa-red hover:text-chifa-red rounded-full text-sm font-bold whitespace-nowrap shadow-sm transition-all">
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {menuData.map(item => (
            <div key={item.id} onClick={() => addItem(item)} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-chifa-red hover:shadow-md cursor-pointer transition-all active:scale-95">
              <h3 className="font-bold text-sm mb-2 text-gray-800">{item.name}</h3>
              <p className="text-chifa-red font-black">S/ {item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Derecho */}
      <div className="w-full md:w-1/3 bg-white border-l border-gray-300 flex flex-col h-screen shadow-2xl z-10">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-black flex items-center gap-2 text-gray-900"><ChefHat className="text-gray-500" /> Comanda</h2>
          <span className="bg-chifa-red text-white text-xs px-3 py-1 rounded-full font-bold">{orderItems.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {orderItems.length === 0 ? (
            <p className="text-gray-400 text-center mt-10 text-sm font-medium">Seleccione platos para armar la comanda.</p>
          ) : (
            orderItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 font-medium">S/ {(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-chifa-red bg-red-50 px-2 py-1 rounded">x{item.qty}</span>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-bold">Notas a Cocina</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej. Sin cebolla..." className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:border-chifa-red focus:ring-1 focus:ring-chifa-red shadow-sm" />
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600 font-bold uppercase">Total</span>
            <span className="text-3xl font-black text-gray-900">S/ {total.toFixed(2)}</span>
          </div>
          <button disabled={orderItems.length === 0} className="w-full bg-chifa-red hover:bg-red-800 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md">
            <Send size={18} /> ENVIAR A COCINA
          </button>
        </div>
      </div>
    </div>
  );
}