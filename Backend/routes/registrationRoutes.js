const express = require('express');
const router = express.Router();
const {
  registerHackathon,
  cancelRegistration,
  getMyRegistrations,
  getRegistrationStatus,
  approveRegistration,
  rejectRegistration,
  getHackathonRegistrations
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');

// Participant Routes
router.post('/', protect, registerHackathon);
router.delete('/:id', protect, cancelRegistration);
router.get('/my', protect, getMyRegistrations);
router.get('/status/:hackathonId', protect, getRegistrationStatus);

// Organizer / Admin Panel Routes
router.get('/hackathon/:hackathonId', protect, isOrganizer, getHackathonRegistrations);
router.patch('/:id/approve', protect, isOrganizer, approveRegistration);
router.patch('/:id/reject', protect, isOrganizer, rejectRegistration);

module.exports = router;
