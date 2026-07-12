import axios from 'axios';

// Admin uses its own axios instance with ADMIN_JWT_SECRET tokens
const adminApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const adminService = {
  login: (data) => adminApi.post('/admin/login', data),
  getUsers: () => adminApi.get('/admin/users'),
  createUser: (data) => adminApi.post('/admin/users', data),
  deleteUser: (id) => adminApi.delete(`/admin/users/${id}`),
  toggleUser: (id) => adminApi.patch(`/admin/users/${id}/toggle`),
  getStats: () => adminApi.get('/admin/stats'),
};

export default adminService;
