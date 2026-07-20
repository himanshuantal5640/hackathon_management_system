const Registration = require('../models/Registration');
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');

// @desc    Register for a hackathon
// @route   POST /api/registrations
// @access  Private (Participant / Admin)
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
    if (hackathon.status !== 'Registration Open') {
      return res.status(400).json({
        success: false,
        message: `Registration is currently closed. Status: ${hackathon.status}`
      });
    }

    // Check Registration Deadline
    if (new Date() > new Date(hackathon.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline for this hackathon has crossed.'
      });
    }

    // Check Duplicate Registration
    const existingReg = await Registration.findOne({
      participant: req.user._id,
      hackathon: hackathonId
    });

    if (existingReg && existingReg.status !== 'Cancelled') {
      return res.status(409).json({
        success: false,
        message: 'You have already registered for this hackathon'
      });
    }

    // If existing registration was cancelled, re-activate as Pending
    let registration;
    if (existingReg && existingReg.status === 'Cancelled') {
      existingReg.status = 'Pending';
      existingReg.registeredAt = new Date();
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

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private (Participant Owner)
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
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in participant's registrations
// @route   GET /api/registrations/my
// @access  Private (Participant / Admin)
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

// @desc    Get registration status for a specific hackathon
// @route   GET /api/registrations/status/:hackathonId
// @access  Private (Participant / Admin)
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
      isRegistered: Boolean(registration && registration.status !== 'Cancelled'),
      registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve registration
// @route   PATCH /api/registrations/:id/approve
// @access  Private (Organizer / Admin)
const approveRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('hackathon');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found'
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

// @desc    Reject registration
// @route   PATCH /api/registrations/:id/reject
// @access  Private (Organizer / Admin)
const rejectRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('hackathon');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found'
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

// @desc    Get registrations for a specific hackathon (Organizer / Admin Panel)
// @route   GET /api/registrations/hackathon/:hackathonId
// @access  Private (Organizer / Admin)
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
