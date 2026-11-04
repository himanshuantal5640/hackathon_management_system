const Registration = require('../models/Registration');
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const Team = require('../models/Team');

const registerHackathon = async (req, res, next) => {
  try {
    const { hackathonId } = req.body;

    if (!hackathonId) {
      return res.status(400).json({
        success: false,
        message: 'Hackathon ID is required'
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Check Hackathon Status
    const allowedStatuses = ['Registration Open', 'Upcoming'];
    if (!allowedStatuses.includes(hackathon.status) || hackathon.status === 'Registration Closed' || hackathon.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: `Registration is currently closed for this hackathon. Status: ${hackathon.status}`
      });
    }

    // Check Registration Deadline
    if (new Date() > new Date(hackathon.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline for this hackathon has passed.'
      });
    }

    // Check Duplicate Registration
    const existingReg = await Registration.findOne({
      participant: req.user._id,
      hackathon: hackathonId
    });

    if (existingReg && (existingReg.status === 'Pending' || existingReg.status === 'Approved')) {
      return res.status(409).json({
        success: false,
        message: existingReg.status === 'Approved'
          ? 'You are already an approved participant in this hackathon.'
          : 'You have already registered for this hackathon. Awaiting organizer approval.'
      });
    }

    // If existing registration was cancelled or rejected, re-activate as Pending
    let registration;
    if (existingReg) {
      existingReg.status = 'Pending';
      existingReg.registeredAt = new Date();
      existingReg.remarks = '';
      existingReg.approvedBy = null;
      existingReg.team = null;
      registration = await existingReg.save();
    } else {
      registration = await Registration.create({
        participant: req.user._id,
        hackathon: hackathonId,
        status: 'Pending'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Pending organizer approval.',
      registration
    });
  } catch (error) {
    next(error);
  }
};


const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.participant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only cancel your own registration.'
      });
    }

    registration.status = 'Cancelled';
    registration.team = null;
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};


const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ participant: req.user._id })
      .populate('hackathon')
      .populate('team')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    next(error);
  }
};


const getRegistrationStatus = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      participant: req.user._id,
      hackathon: req.params.hackathonId
    })
      .populate('team')
      .populate('hackathon', 'title status registrationDeadline');

    res.status(200).json({
      success: true,
      isRegistered: Boolean(registration && ['Pending', 'Approved'].includes(registration.status)),
      registration
    });
  } catch (error) {
    next(error);
  }
};


const approveRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('hackathon');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found'
      });
    }

    if (!registration.hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Associated hackathon not found'
      });
    }

    // Check organizer permission
    if (req.user.role !== 'admin' && registration.hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only approve registrations for your own hackathons.'
      });
    }

    registration.status = 'Approved';
    registration.approvedBy = req.user._id;
    if (req.body.remarks) registration.remarks = req.body.remarks;

    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration APPROVED successfully',
      registration
    });
  } catch (error) {
    next(error);
  }
};


const rejectRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('hackathon');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found'
      });
    }

    if (!registration.hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Associated hackathon not found'
      });
    }

    // Check organizer permission
    if (req.user.role !== 'admin' && registration.hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only reject registrations for your own hackathons.'
      });
    }

    registration.status = 'Rejected';
    if (req.body.remarks) registration.remarks = req.body.remarks;

    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration REJECTED',
      registration
    });
  } catch (error) {
    next(error);
  }
};


const getHackathonRegistrations = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const hackathon = await Hackathon.findById(req.params.hackathonId);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Verify organizer permission
    if (req.user.role !== 'admin' && hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view registrations for your owned hackathons.'
      });
    }

    let query = { hackathon: req.params.hackathonId };

    if (status && status !== 'All') {
      query.status = status;
    }

    let registrations = await Registration.find(query)
      .populate('participant', 'name email profileImage role')
      .populate('team', 'teamName inviteCode members')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    // Client/query search by participant name or email
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      registrations = registrations.filter(r => 
        r.participant && (regex.test(r.participant.name) || regex.test(r.participant.email))
      );
    }

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerHackathon,
  cancelRegistration,
  getMyRegistrations,
  getRegistrationStatus,
  approveRegistration,
  rejectRegistration,
  getHackathonRegistrations
};
