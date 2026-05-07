import axios from 'axios';

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

    if(shouldExclude) {
        return config;
    }

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;