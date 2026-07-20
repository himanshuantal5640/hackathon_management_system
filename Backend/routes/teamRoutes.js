const express = require('express');
const router = express.Router();
const {
  createTeam,
  updateTeam,
  deleteTeam,
  joinTeam,
  leaveTeam,
  removeMember,
  transferLeadership,
  getMyTeam,
  getHackathonTeams,
  getTeamByInviteCode
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');

// Participant Team Actions
router.post('/', protect, createTeam);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);
router.post('/join', protect, joinTeam);
router.patch('/:id/leave', protect, leaveTeam);
router.patch('/:id/remove-member', protect, removeMember);
router.patch('/:id/transfer-leader', protect, transferLeadership);
router.get('/my', protect, getMyTeam);
router.get('/invite/:inviteCode', protect, getTeamByInviteCode);

// Organizer / Admin View Teams
router.get('/hackathon/:hackathonId', protect, isOrganizer, getHackathonTeams);

module.exports = router;
