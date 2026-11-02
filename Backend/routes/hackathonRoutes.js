const express = require('express');
const router = express.Router();
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  getMyHackathons,
  publishHackathon,
  openRegistration,
  closeRegistration
} = require('../controllers/hackathonController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer, checkHackathonOwnership } = require('../middleware/organizerMiddleware');

// Public route for listing hackathons (supports optional auth in controller)
router.get('/', getAllHackathons);

// Private Organizer routes
router.get('/my', protect, isOrganizer, getMyHackathons);
router.post('/', protect, isOrganizer, createHackathon);

// Single Hackathon detail route
router.get('/:id', getHackathonById);

// Owner / Admin mutation routes
router.put('/:id', protect, isOrganizer, checkHackathonOwnership, updateHackathon);
router.delete('/:id', protect, isOrganizer, checkHackathonOwnership, deleteHackathon);
router.patch('/:id/publish', protect, isOrganizer, checkHackathonOwnership, publishHackathon);
router.patch('/:id/open-registration', protect, isOrganizer, checkHackathonOwnership, openRegistration);
router.patch('/:id/close-registration', protect, isOrganizer, checkHackathonOwnership, closeRegistration);

module.exports = router;
