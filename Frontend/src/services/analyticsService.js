import API from './api';

export const analyticsService = {
  getAdminAnalytics: async () => {
    const response = await API.get('/analytics/admin');
    return response.data;
  },

  getOrganizerAnalytics: async () => {
    const response = await API.get('/analytics/organizer');
    return response.data;
  },

  getJudgeAnalytics: async () => {
    const response = await API.get('/analytics/judge');
    return response.data;
  },

  getParticipantAnalytics: async () => {
    const response = await API.get('/analytics/participant');
    return response.data;
  },
};
