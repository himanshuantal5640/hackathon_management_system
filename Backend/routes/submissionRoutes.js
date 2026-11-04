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
  changeSubmissionStatus,
  getSubmissionFile
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');
const { uploadSubmissionFiles } = require('../middleware/uploadMiddleware');

// File view/download endpoint (public with safe basename sanitization)
router.get('/file/:filename', getSubmissionFile);

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
