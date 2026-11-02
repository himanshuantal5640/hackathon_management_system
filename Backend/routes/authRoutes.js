const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);

// Protected profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

module.exports = router;
