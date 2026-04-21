import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import TableMap from './pages/salon/TableMap';
import TakeOrder from './pages/salon/TakeOrder';
import KdsMonitor from './pages/kitchen/KdsMonitor'; 
import Dashboard from './pages/admin/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/salon" element={<TableMap />} />
        <Route path="/comanda" element={<TakeOrder />} />
        
        {/* Nueva ruta de la Cocina */}
        <Route path="/cocina" element={<KdsMonitor />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;