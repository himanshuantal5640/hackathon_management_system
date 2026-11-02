const express = require('express');
const router = express.Router();
const {
  assignJudge,
  getJudgeAssignments,
  getAvailableJudges
} = require('../controllers/judgeAssignmentController');
const {
  createReview,
  updateReview,
  submitReview,
  lockReview,
  getSubmissionReviews,
  getJudgeReviews,
  getReviewById
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');

// Organizer Judge Assignment Endpoints
router.post('/assign', protect, isOrganizer, assignJudge);
router.get('/assignments', protect, getJudgeAssignments);
router.get('/judges', protect, isOrganizer, getAvailableJudges);

// Judge Review Evaluation Endpoints
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.patch('/:id/submit', protect, submitReview);
router.patch('/:id/lock', protect, isOrganizer, lockReview);
router.get('/judge', protect, getJudgeReviews);
router.get('/submission/:submissionId', protect, getSubmissionReviews);
router.get('/:id', protect, getReviewById);

module.exports = router;
