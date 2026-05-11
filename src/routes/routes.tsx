import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
// @ts-expect-error Login is still authored as JSX.
import Login from '../pages/auth/Login';
import KdsMonitor from '../pages/kitchen/KdsMonitor';
import TableMap from '../pages/salon/TableMap';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/salon" element={<TableMap />} />
          <Route path="/cocina" element={<KdsMonitor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}