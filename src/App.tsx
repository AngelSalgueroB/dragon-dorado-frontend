import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';

// 1. Importamos tus otras vistas
import TableMap from './pages/salon/TableMap';
import KdsMonitor from './pages/kitchen/KdsMonitor';
import DashboardLayout from './layout/DashboardLayout';
import DriversPage from './pages/drivers/DriversPage';
import TablesPage from './pages/tables/TablesPage';
import ClientsPage from './pages/clients/ClientsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/conductores" element={<DriversPage />} />
          <Route path="/mesas" element={<TablesPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/salon" element={<TableMap />} />
          <Route path="/cocina" element={<KdsMonitor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
