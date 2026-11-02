const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(u => u.toSafeObject ? u.toSafeObject() : u)
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['admin', 'organizer', 'participant', 'judge'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${allowedRoles.join(', ')}`
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }


    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserBlock = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent blocking oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block your own administrator account'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrator account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllHackathons = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: hackathons.length,
      hackathons
    });
  } catch (error) {
    next(error);
  }
};

const deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    await Hackathon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Hackathon "${hackathon.title}" deleted successfully by administrator`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  toggleUserBlock,
  deleteUser,
  getAllHackathons,
  deleteHackathon
};
