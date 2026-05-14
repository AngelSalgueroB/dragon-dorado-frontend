import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/auth.store';

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
