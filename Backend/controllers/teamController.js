const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Create a new team for a hackathon
// @route   POST /api/teams
// @access  Private (Participant / Admin)
const createTeam = async (req, res, next) => {
  try {
    const { teamName, hackathonId, maxMembers } = req.body;

    if (!teamName || !hackathonId) {
      return res.status(400).json({
        success: false,
        message: 'Team name and hackathon ID are required'
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Check team size against hackathon's maximum allowed team size
    const limit = Number(maxMembers) || hackathon.maxTeamSize;
    if (limit > hackathon.maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: `Team size cannot exceed the hackathon limit of ${hackathon.maxTeamSize}`
      });
    }

    // Check if user is already in an Active team for this hackathon
    const existingTeam = await Team.findOne({
      hackathon: hackathonId,
      members: req.user._id,
      status: 'Active'
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: `You are already part of an active team ("${existingTeam.teamName}") for this hackathon.`
      });
    }

    const team = await Team.create({
      teamName,
      leader: req.user._id,
      members: [req.user._id],
      hackathon: hackathonId,
      maxMembers: limit,
      status: 'Active'
    });

    // Link team to user's registration if registered
    await Registration.findOneAndUpdate(
      { participant: req.user._id, hackathon: hackathonId },
      { team: team._id }
    );

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profileImage')
      .populate('members', 'name email profileImage')
      .populate('hackathon', 'title maxTeamSize');

    res.status(201).json({
      success: true,
      message: 'Team created successfully!',
      team: populatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team name
// @route   PUT /api/teams/:id
// @access  Private (Team Leader / Admin)
const updateTeam = async (req, res, next) => {
  try {
    const { teamName } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team || team.status === 'Disbanded') {
      return res.status(404).json({
        success: false,
        message: 'Team not found or has been disbanded'
      });
    }

    if (team.leader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the team leader can edit the team.'
      });
    }

    if (teamName) team.teamName = teamName;
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Team name updated successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disband / Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Team Leader / Admin)
const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    if (team.leader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the team leader can delete/disband the team.'
      });
    }

    // Unlink team reference from all members' registrations
    await Registration.updateMany(
      { team: team._id },
      { $set: { team: null } }
    );

    team.status = 'Disbanded';
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Team disbanded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join team via invite code
// @route   POST /api/teams/join
// @access  Private (Participant / Admin)
const joinTeam = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        success: false,
        message: 'Invite code is required to join a team'
      });
    }

    const team = await Team.findOne({
      inviteCode: inviteCode.trim().toUpperCase(),
      status: 'Active'
    }).populate('hackathon');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code or team no longer active.'
      });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: `Team "${team.teamName}" has reached its maximum capacity of ${team.maxMembers} members.`
      });
    }

    // Check if user is already in this team
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team.'
      });
    }

    // Check if user is already in another team for the same hackathon
    const inOtherTeam = await Team.findOne({
      hackathon: team.hackathon._id,
      members: req.user._id,
      status: 'Active'
    });

    if (inOtherTeam) {
      return res.status(409).json({
        success: false,
        message: `You are already part of team "${inOtherTeam.teamName}" for this hackathon.`
      });
    }

    // Add user to team members
    team.members.push(req.user._id);
    await team.save();

    // Link team to user's registration if exists
    await Registration.findOneAndUpdate(
      { participant: req.user._id, hackathon: team.hackathon._id },
      { team: team._id }
    );

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profileImage')
      .populate('members', 'name email profileImage')
      .populate('hackathon', 'title');

    res.status(200).json({
      success: true,
      message: `Successfully joined team "${team.teamName}"!`,
      team: updatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave team
// @route   PATCH /api/teams/:id/leave
// @access  Private (Participant Member)
const leaveTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team || team.status === 'Disbanded') {
      return res.status(404).json({
        success: false,
        message: 'Team not found or has been disbanded'
      });
    }

    // Check if user is in team
    if (!team.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this team.'
      });
    }

    // Leader rule check: Leader cannot leave team until leadership is transferred
    if (team.leader.toString() === req.user._id.toString() && team.members.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'As team leader, you cannot leave until you transfer leadership to another member.'
      });
    }

    // If sole member leaving, mark team as Disbanded
    if (team.members.length === 1) {
      team.status = 'Disbanded';
    }

    team.members = team.members.filter(m => m.toString() !== req.user._id.toString());
    await team.save();

    // Unlink registration
    await Registration.findOneAndUpdate(
      { participant: req.user._id, hackathon: team.hackathon },
      { team: null }
    );

    res.status(200).json({
      success: true,
      message: 'You have left the team successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from team (Leader only)
// @route   PATCH /api/teams/:id/remove-member
// @access  Private (Team Leader / Admin)
const removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team || team.status === 'Disbanded') {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    if (team.leader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the team leader can remove members.'
      });
    }

    if (memberId === team.leader.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove team leader. Transfer leadership or delete the team.'
      });
    }

    team.members = team.members.filter(m => m.toString() !== memberId);
    await team.save();

    // Unlink registration for removed member
    await Registration.findOneAndUpdate(
      { participant: memberId, hackathon: team.hackathon },
      { team: null }
    );

    res.status(200).json({
      success: true,
      message: 'Member removed from team',
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer team leadership
// @route   PATCH /api/teams/:id/transfer-leader
// @access  Private (Team Leader / Admin)
const transferLeadership = async (req, res, next) => {
  try {
    const { newLeaderId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team || team.status === 'Disbanded') {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    if (team.leader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the current leader can transfer leadership.'
      });
    }

    if (!team.members.includes(newLeaderId)) {
      return res.status(400).json({
        success: false,
        message: 'New leader must be an existing member of the team.'
      });
    }

    team.leader = newLeaderId;
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profileImage')
      .populate('members', 'name email profileImage');

    res.status(200).json({
      success: true,
      message: 'Leadership transferred successfully',
      team: updatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's team(s)
// @route   GET /api/teams/my
// @access  Private (Participant / Admin)
const getMyTeam = async (req, res, next) => {
  try {
    const { hackathonId } = req.query;

    let query = {
      members: req.user._id,
      status: 'Active'
    };

    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    const teams = await Team.find(query)
      .populate('leader', 'name email profileImage')
      .populate('members', 'name email profileImage')
      .populate('hackathon', 'title mode venue status registrationDeadline maxTeamSize');

    res.status(200).json({
      success: true,
      count: teams.length,
      teams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams for a hackathon (Organizer / Admin view)
// @route   GET /api/teams/hackathon/:hackathonId
// @access  Private (Organizer / Admin)
const getHackathonTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      hackathon: req.params.hackathonId,
      status: 'Active'
    })
      .populate('leader', 'name email profileImage')
      .populate('members', 'name email profileImage')
      .populate('hackathon', 'title maxTeamSize');

    res.status(200).json({
      success: true,
      count: teams.length,
      teams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team preview by invite code
// @route   GET /api/teams/invite/:inviteCode
// @access  Private / Public
const getTeamByInviteCode = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      inviteCode: req.params.inviteCode.trim().toUpperCase(),
      status: 'Active'
    })
      .populate('leader', 'name email profileImage')
      .populate('members', 'name email profileImage')
      .populate('hackathon', 'title mode venue maxTeamSize status');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code or team is no longer active.'
      });
    }

    res.status(200).json({
      success: true,
      team
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
