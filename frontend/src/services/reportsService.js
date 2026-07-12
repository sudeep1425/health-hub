import api from './api';

const reportsService = {
  getReport: (userId, days = 30) => api.get(`/reports/${userId}?days=${days}`),
  getExportUrl: (userId) => `/api/reports/${userId}/export`,
};

export default reportsService;
