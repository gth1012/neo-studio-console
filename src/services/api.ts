import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://neo-studio-api-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('neo-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 시 refresh 시도 → 실패 시 로그아웃
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const currentToken = localStorage.getItem('neo-token');
        if (!currentToken) throw new Error('No token');
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'https://neo-studio-api-production.up.railway.app'}/api/admin/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
        const newToken = res.data.token;
        localStorage.setItem('neo-token', newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('neo-token');
        localStorage.removeItem('neo-user');
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
