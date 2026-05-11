import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  redirectTo?: string;
}

export default function PublicRoute({
  redirectTo = '/dashboard',
}: PublicRouteProps) {
  const token = localStorage.getItem('accessToken');

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
