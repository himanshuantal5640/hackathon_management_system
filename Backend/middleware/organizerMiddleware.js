const Hackathon = require('../models/Hackathon');

// Middleware to restrict routes to organizers and admins only
const isOrganizer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only organizers can perform this action.'
    });
  }

  next();
};

// Middleware to check if the hackathon is owned by the logged-in organizer
const checkHackathonOwnership = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: `Hackathon not found with id ${req.params.id}`
      });
    }

    // Admin override allowed
    if (req.user.role === 'admin') {
      req.hackathon = hackathon;
      return next();
    }

    // Check ownership
    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to modify this hackathon.'
      });
    }

    req.hackathon = hackathon;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isOrganizer,
  checkHackathonOwnership
};
