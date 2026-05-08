import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';

// 1. Importamos tus otras vistas
import TableMap from './pages/salon/TableMap';
import KdsMonitor from './pages/kitchen/KdsMonitor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        // 2. Agregamos las rutas para que React las encuentre
        <Route path="/salon" element={<TableMap />} />
        <Route path="/cocina" element={<KdsMonitor />} />
      </Routes>
    </BrowserRouter>
  )
}