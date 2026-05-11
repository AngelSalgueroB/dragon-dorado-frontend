import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export default function ProtectedRoute({
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}