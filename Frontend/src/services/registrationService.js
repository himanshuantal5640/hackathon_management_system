import API from './api';

export const registrationService = {
  // Register for hackathon
  registerHackathon: async (hackathonId) => {
    const response = await API.post('/registrations', { hackathonId });
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (registrationId) => {
    const response = await API.delete(`/registrations/${registrationId}`);
    return response.data;
  },

  // Get logged in participant's registrations
  getMyRegistrations: async () => {
    const response = await API.get('/registrations/my');
    return response.data;
  },

  // Check registration status for specific hackathon
  getRegistrationStatus: async (hackathonId) => {
    const response = await API.get(`/registrations/status/${hackathonId}`);
    return response.data;
  },

  // Organizer: Get registrations for a hackathon
  getHackathonRegistrations: async (hackathonId, params = {}) => {
    const response = await API.get(`/registrations/hackathon/${hackathonId}`, { params });
    return response.data;
  },

  // Organizer: Approve registration
  approveRegistration: async (registrationId, remarks = '') => {
    const response = await API.patch(`/registrations/${registrationId}/approve`, { remarks });
    return response.data;
  },

  // Organizer: Reject registration
  rejectRegistration: async (registrationId, remarks = '') => {
    const response = await API.patch(`/registrations/${registrationId}/reject`, { remarks });
    return response.data;
  },
};
