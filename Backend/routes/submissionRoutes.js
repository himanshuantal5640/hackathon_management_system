const express = require('express');
const router = express.Router();
const {
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionById,
  getMySubmission,
  getHackathonSubmissions,
  submitProject,
  changeSubmissionStatus
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');
const { uploadSubmissionFiles } = require('../middleware/uploadMiddleware');

// Participant Submission Actions (Leader)
router.post('/', protect, uploadSubmissionFiles, createSubmission);
router.put('/:id', protect, uploadSubmissionFiles, updateSubmission);
router.delete('/:id', protect, deleteSubmission);
router.get('/my', protect, getMySubmission);
router.patch('/:id/submit', protect, submitProject);

// Single Submission Details
router.get('/:id', protect, getSubmissionById);

// Organizer Panel Submissions
router.get('/hackathon/:hackathonId', protect, isOrganizer, getHackathonSubmissions);
router.patch('/:id/status', protect, isOrganizer, changeSubmissionStatus);

module.exports = router;
