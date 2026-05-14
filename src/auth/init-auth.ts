import * as jose from 'jose';
import useAuthStore from '../store/auth.store';
import { Role } from '../actions/users/users.interfaces';

export function initAuth() {
  const token = localStorage.getItem('accessToken');

  if (!token) return;

  try {
    const decoded = jose.decodeJwt(token);

    useAuthStore.getState().setUser({
      username: decoded.sub || '',
      role: decoded.role as Role,
    });
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
