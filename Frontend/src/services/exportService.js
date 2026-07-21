export const exportService = {
  getCSVUrl: (hackathonId) => {
    return `/api/export/leaderboard/csv/${hackathonId}`;
  },

  getPDFUrl: (hackathonId) => {
    return `/api/export/leaderboard/pdf/${hackathonId}`;
  },
};
