import api from './api';

const dietService = {
  getAll: (userId) => api.get(`/diet/${userId}`),
  getSummary: () => api.get('/diet/summary'),
  create: (data) => api.post('/diet', data),
  update: (id, data) => api.put(`/diet/${id}`, data),
  delete: (id) => api.delete(`/diet/${id}`),
};

export default dietService;
