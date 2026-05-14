import * as jose from 'jose';
import axios from 'axios';
import { toast } from 'react-toastify';
import { JwtResponse } from '../actions/auth/auth.interfaces';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000,
});

const authApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const excludedEndpoints = ['/auth/login', '/auth/refresh'];
    const shouldExclude = excludedEndpoints.some((route) =>
      config.url?.includes(route),
    );

    if (shouldExclude) {
      return config;
    }

    await handleTokenRefresh();

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.log(error);

    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    if (response && response.status === 401) {
      localStorage.removeItem('accessToken');
      toast.error(
        response?.data?.detail ||
          'Sesión expirada. Por favor, inicia sesión nuevamente.',
        { toastId: 'auth-error' },
      );

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (response && response.status === 403) {
      toast.error(
        response?.data?.detail ||
          'No tienes permiso para realizar esta acción.',
        { toastId: 'auth-error' },
      );
      return Promise.reject(error);
    }

    const data = response?.data;

    if (data?.errors?.length > 0) {
      const errorMessages: string[] = data.errors;
      errorMessages.forEach((errorMessage) => {
        toast.error(errorMessage, {
          autoClose: 15000,
          toastId: `api-error-${errorMessage}`,
        });
      });
      return Promise.reject(error);
    }

    const errorMessage = data?.detail || 'Error desconocido';
    toast.error(errorMessage, { toastId: 'api-error' });

    return Promise.reject(error);
  },
);

async function handleTokenRefresh(): Promise<void> {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  const decoded = jose.decodeJwt(accessToken);
  const exp = decoded.exp || 0;
  const now = Math.floor(Date.now() / 1000);

  const isExpired = exp < now;
  if (!isExpired) return;

  const refreshTokenValue = localStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    localStorage.removeItem('accessToken');
    return;
  }

  const response = await authApi.post<JwtResponse>('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });
  console.log({response});
  
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
}

export default apiClient;
