import API from './api';

export const hackathonService = {
  // Create new hackathon
  createHackathon: async (data) => {
    const response = await API.post('/hackathons', data);
    return response.data;
  },

  // Get public hackathons with search, filter, and sorting
  getAllHackathons: async (params = {}) => {
    const response = await API.get('/hackathons', { params });
    return response.data;
  },

  // Get hackathons owned by current logged in organizer
  getMyHackathons: async () => {
    const response = await API.get('/hackathons/my');
    return response.data;
  },

  // Get hackathon details by ID
  getHackathonById: async (id) => {
    const response = await API.get(`/hackathons/${id}`);
    return response.data;
  },

  // Update hackathon
  updateHackathon: async (id, data) => {
    const response = await API.put(`/hackathons/${id}`, data);
    return response.data;
  },

  // Delete hackathon
  deleteHackathon: async (id) => {
    const response = await API.delete(`/hackathons/${id}`);
    return response.data;
  },

  // Publish hackathon
  publishHackathon: async (id) => {
    const response = await API.patch(`/hackathons/${id}/publish`);
    return response.data;
  },

  // Open registration
  openRegistration: async (id) => {
    const response = await API.patch(`/hackathons/${id}/open-registration`);
    return response.data;
  },

  // Close registration
  closeRegistration: async (id) => {
    const response = await API.patch(`/hackathons/${id}/close-registration`);
    return response.data;
  },
};
