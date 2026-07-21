const express = require('express');
const router = express.Router();
const {
  generateLeaderboard,
  declareWinners,
  publishResults,
  hideResults,
  getLeaderboard
} = require('../controllers/leaderboardController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');

// Organizer Actions
router.post('/generate/:hackathonId', protect, isOrganizer, generateLeaderboard);
router.patch('/declare-winners/:hackathonId', protect, isOrganizer, declareWinners);
router.patch('/publish/:hackathonId', protect, isOrganizer, publishResults);
router.patch('/hide/:hackathonId', protect, isOrganizer, hideResults);

// Public / Participant / Organizer Leaderboard Fetch (optionalAuth attaches req.user if logged in)
router.get('/:hackathonId', optionalAuth, getLeaderboard);

module.exports = router;
