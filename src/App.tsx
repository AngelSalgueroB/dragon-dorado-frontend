import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';

import TableMap from './pages/salon/TableMap';
import KdsMonitor from './pages/kitchen/KdsMonitor';
import DashboardLayout from './layout/DashboardLayout';
import DriversPage from './pages/drivers/DriversPage';
import TablesPage from './pages/tables/TablesPage';
import ClientsPage from './pages/clients/ClientsPage';
import UsersPage from './pages/users/UsersPage';
import ActivateAccountPage from './pages/activate-account/ActivateAccountPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import ProductPage from './pages/products/ProductsPage';
import CashRegisterPage from './pages/cash-register/CashRegisterPage';
import OrdersPage from './pages/orders/OrdersPage';
import ProtectedRoute from './guards/ProtectedRoute';
import PosPage from './pages/pos/PosPage';
import CreateDineInOrderPage from './pages/pos/CreateDineInOrderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/activate" element={<ActivateAccountPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<PosPage />} />
            <Route path="/pedidos/salon" element={<CreateDineInOrderPage />} />
            <Route path="/conductores" element={<DriversPage />} />
            <Route path="/mesas" element={<TablesPage />} />
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/productos" element={<ProductPage />} />
            <Route path="/caja" element={<CashRegisterPage />} />
            <Route path="/ordenes" element={<OrdersPage />} />

            <Route path="/salon" element={<TableMap />} />
            <Route path="/cocina" element={<KdsMonitor />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
