import api from './api';

const waterService = {
  getAll: (userId) => api.get(`/water/${userId}`),
  create: (data) => api.post('/water', data),
  delete: (id) => api.delete(`/water/${id}`),
};

export default waterService;
