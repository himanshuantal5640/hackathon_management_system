import API from './api';

export const adminService = {
  getAllUsers: async () => {
    const response = await API.get('/admin/users');
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await API.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserBlock: async (userId) => {
    const response = await API.patch(`/admin/users/${userId}/block`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllHackathons: async () => {
    const response = await API.get('/admin/hackathons');
    return response.data;
  },

  deleteHackathon: async (hackathonId) => {
    const response = await API.delete(`/admin/hackathons/${hackathonId}`);
    return response.data;
  }
};
