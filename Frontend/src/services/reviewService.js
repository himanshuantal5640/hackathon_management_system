import API from './api';

export const reviewService = {
  // Organizer: Assign judge to submission
  assignJudge: async (data) => {
    const response = await API.post('/reviews/assign', data);
    return response.data;
  },

  // Judge: Get assigned project submissions
  getJudgeAssignments: async (params = {}) => {
    const response = await API.get('/reviews/assignments', { params });
    return response.data;
  },

  // Organizer: Get list of available judges
  getAvailableJudges: async () => {
    const response = await API.get('/reviews/judges');
    return response.data;
  },

  // Judge: Create review (Draft or Completed)
  createReview: async (data) => {
    const response = await API.post('/reviews', data);
    return response.data;
  },

  // Judge: Update review draft
  updateReview: async (id, data) => {
    const response = await API.put(`/reviews/${id}`, data);
    return response.data;
  },

  // Judge: Finalize and submit review
  submitReview: async (id) => {
    const response = await API.patch(`/reviews/${id}/submit`);
    return response.data;
  },

  // Organizer: Lock review
  lockReview: async (id) => {
    const response = await API.patch(`/reviews/${id}/lock`);
    return response.data;
  },

  // Judge: Get current judge's reviews
  getJudgeReviews: async (params = {}) => {
    const response = await API.get('/reviews/judge', { params });
    return response.data;
  },

  // Get reviews for a submission
  getSubmissionReviews: async (submissionId) => {
    const response = await API.get(`/reviews/submission/${submissionId}`);
    return response.data;
  },

  // Get review by ID
  getReviewById: async (id) => {
    const response = await API.get(`/reviews/${id}`);
    return response.data;
  },
};
