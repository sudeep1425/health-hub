import api from './api';

const achievementService = {
  getAll: (userId) => api.get(`/achievements/${userId}`),
};

export default achievementService;
