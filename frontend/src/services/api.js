import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password) => api.post('/auth/register', { email, password }),
  getMe: () => api.get('/auth/me'),
  regenerateApiKey: () => api.post('/auth/regenerate-api-key'),
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }
};

// Dashboard API
export const dashboardAPI = {
  getData: (params) => api.get('/dashboard', { params }),
};

// Alerts API
export const alertsAPI = {
  getAll: () => api.get('/alerts'),
  create: (alertData) => api.post('/alerts', alertData),
  update: (id, alertData) => api.put(`/alerts/${id}`, alertData),
  delete: (id) => api.delete(`/alerts/${id}`),
};

export default api;