import API from './api';

export const submissionService = {
  // Create submission (Multipart FormData)
  createSubmission: async (formData) => {
    const response = await API.post('/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update submission (Multipart FormData)
  updateSubmission: async (id, formData) => {
    const response = await API.put(`/submissions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete submission draft
  deleteSubmission: async (id) => {
    const response = await API.delete(`/submissions/${id}`);
    return response.data;
  },

  // Get submission by ID
  getSubmissionById: async (id) => {
    const response = await API.get(`/submissions/${id}`);
    return response.data;
  },

  // Get current user's team submission
  getMySubmission: async (params = {}) => {
    const response = await API.get('/submissions/my', { params });
    return response.data;
  },

  // Organizer: Get hackathon submissions
  getHackathonSubmissions: async (hackathonId, params = {}) => {
    const response = await API.get(`/submissions/hackathon/${hackathonId}`, { params });
    return response.data;
  },

  // Submit final project
  submitProject: async (id) => {
    const response = await API.patch(`/submissions/${id}/submit`);
    return response.data;
  },

  // Organizer: Change submission status
  changeSubmissionStatus: async (id, status) => {
    const response = await API.patch(`/submissions/${id}/status`, { status });
    return response.data;
  },
};
