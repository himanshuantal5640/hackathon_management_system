import API from './api';

export const leaderboardService = {
  // Organizer: Generate automatic leaderboard
  generateLeaderboard: async (hackathonId) => {
    const response = await API.post(`/leaderboard/generate/${hackathonId}`);
    return response.data;
  },

  // Organizer: Declare podium winners
  declareWinners: async (hackathonId, data) => {
    const response = await API.patch(`/leaderboard/declare-winners/${hackathonId}`, data);
    return response.data;
  },

  // Organizer: Publish results to public
  publishResults: async (hackathonId) => {
    const response = await API.patch(`/leaderboard/publish/${hackathonId}`);
    return response.data;
  },

  // Organizer: Hide results from public
  hideResults: async (hackathonId) => {
    const response = await API.patch(`/leaderboard/hide/${hackathonId}`);
    return response.data;
  },

  // Public / Participant / Organizer leaderboard query
  getLeaderboard: async (hackathonId, params = {}) => {
    const response = await API.get(`/leaderboard/${hackathonId}`, { params });
    return response.data;
  },
};
