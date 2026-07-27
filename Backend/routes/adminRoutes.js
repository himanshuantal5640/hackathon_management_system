const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const {
  getAllUsers,
  updateUserRole,
  toggleUserBlock,
  deleteUser,
  getAllHackathons,
  deleteHackathon
} = require('../controllers/adminController');

// All routes here require login and admin privileges
router.use(protect);
router.use(isAdmin);

// User management endpoints
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.patch('/users/:id/block', toggleUserBlock);
router.delete('/users/:id', deleteUser);

// Hackathon management endpoints
router.get('/hackathons', getAllHackathons);
router.delete('/hackathons/:id', deleteHackathon);

module.exports = router;
