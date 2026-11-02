const express = require('express');
const router = express.Router();
const {
  exportLeaderboardCSV,
  exportLeaderboardPDF
} = require('../controllers/exportController');

router.get('/leaderboard/csv/:hackathonId', exportLeaderboardCSV);
router.get('/leaderboard/pdf/:hackathonId', exportLeaderboardPDF);

module.exports = router;
