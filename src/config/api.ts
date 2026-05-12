import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const excludedEndpoints = ['/auth/login', '/auth/refresh'];
    const shouldExclude = excludedEndpoints.some((route) =>
      config.url?.includes(route),
    );

    if (shouldExclude) {
      return config;
    }

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

    const data = response?.data;
    const errorMessage = data?.detail || 'Error desconocido';
    toast.error(errorMessage, { toastId: 'api-error' });

    return Promise.reject(error);
  },
);

export default apiClient;
