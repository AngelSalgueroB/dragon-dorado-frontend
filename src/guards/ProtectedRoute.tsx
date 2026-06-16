import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { canAccessPath, getHomePathForRole } from '../auth/role-permissions';
import useAuthStore from '../store/auth.store';

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  if (!user) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (!canAccessPath(user.role, location.pathname)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return <Outlet />;
}

