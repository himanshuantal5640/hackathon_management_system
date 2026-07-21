const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getOrganizerAnalytics,
  getJudgeAnalytics,
  getParticipantAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');

router.get('/admin', protect, getAdminAnalytics);
router.get('/organizer', protect, isOrganizer, getOrganizerAnalytics);
router.get('/judge', protect, getJudgeAnalytics);
router.get('/participant', protect, getParticipantAnalytics);

module.exports = router;
