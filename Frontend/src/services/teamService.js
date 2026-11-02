import API from './api';

export const teamService = {
  // Create a new team
  createTeam: async (data) => {
    const response = await API.post('/teams', data);
    return response.data;
  },

  // Update team name
  updateTeam: async (teamId, teamName) => {
    const response = await API.put(`/teams/${teamId}`, { teamName });
    return response.data;
  },

  // Disband / Delete team
  deleteTeam: async (teamId) => {
    const response = await API.delete(`/teams/${teamId}`);
    return response.data;
  },

  // Join team via invite code
  joinTeam: async (inviteCode) => {
    const response = await API.post('/teams/join', { inviteCode });
    return response.data;
  },

  // Leave team
  leaveTeam: async (teamId) => {
    const response = await API.patch(`/teams/${teamId}/leave`);
    return response.data;
  },

  // Remove member (Leader only)
  removeMember: async (teamId, memberId) => {
    const response = await API.patch(`/teams/${teamId}/remove-member`, { memberId });
    return response.data;
  },

  // Transfer leadership
  transferLeadership: async (teamId, newLeaderId) => {
    const response = await API.patch(`/teams/${teamId}/transfer-leader`, { newLeaderId });
    return response.data;
  },

  // Get current user's team(s)
  getMyTeam: async (params = {}) => {
    const response = await API.get('/teams/my', { params });
    return response.data;
  },

  // Organizer: Get teams for a hackathon
  getHackathonTeams: async (hackathonId) => {
    const response = await API.get(`/teams/hackathon/${hackathonId}`);
    return response.data;
  },

  // Lookup team by invite code preview
  getTeamByInviteCode: async (inviteCode) => {
    const response = await API.get(`/teams/invite/${inviteCode}`);
    return response.data;
  },
};
