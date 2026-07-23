const Hackathon = require('../models/Hackathon');

// Helper function to validate hackathon date rules
const validateHackathonDates = (startDate, endDate, registrationDeadline, submissionDeadline) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const deadline = new Date(registrationDeadline);

  const errors = [];
  if (isNaN(start.getTime())) errors.push('Invalid start date format');
  if (isNaN(end.getTime())) errors.push('Invalid end date format');
  if (isNaN(deadline.getTime())) errors.push('Invalid registration deadline format');

  if (errors.length > 0) return errors;

  if (deadline >= start) {
    errors.push('Registration deadline must be before the hackathon start date');
  }
  if (end <= start) {
    errors.push('End date must be after the hackathon start date');
  }

  if (submissionDeadline) {
    const subDeadline = new Date(submissionDeadline);
    if (isNaN(subDeadline.getTime())) {
      errors.push('Invalid submission deadline format');
    } else if (subDeadline <= deadline) {
      errors.push('Submission deadline must be after the registration deadline');
    }
  }

  return errors;
};

// @desc    Create a new hackathon
// @route   POST /api/hackathons
// @access  Private (Organizer / Admin)
const createHackathon = async (req, res, next) => {
  try {
    const {
      title,
      description,
      theme,
      mode,
      venue,
      bannerImage,
      startDate,
      endDate,
      registrationDeadline,
      submissionDeadline,
      prizePool,
      maxTeamSize,
      rules,
      judgingCriteria,
      isPublished
    } = req.body;

    // Validate required fields
    if (
      !title || !description || !theme || !mode || !venue ||
      !startDate || !endDate || !registrationDeadline || !submissionDeadline ||
      prizePool === undefined || !maxTeamSize || !rules || !judgingCriteria
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields, including the Submission Deadline'
      });
    }

    // Validate Team Size
    const teamSize = Number(maxTeamSize);
    if (teamSize < 2 || teamSize > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum team size must be between 2 and 10'
      });
    }

    // Validate Dates
    const dateErrors = validateHackathonDates(startDate, endDate, registrationDeadline, submissionDeadline);
    if (dateErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: dateErrors.join(', ')
      });
    }

    const hackathon = await Hackathon.create({
      title,
      description,
      theme,
      mode,
      venue,
      bannerImage: bannerImage || undefined,
      startDate,
      endDate,
      registrationDeadline,
      submissionDeadline,
      prizePool: Number(prizePool),
      maxTeamSize: teamSize,
      rules,
      judgingCriteria,
      isPublished: Boolean(isPublished),
      status: 'Upcoming',
      createdBy: req.user._id
    });


    res.status(201).json({
      success: true,
      message: 'Hackathon created successfully',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hackathons (Public with Search, Filter & Sort)
// @route   GET /api/hackathons
// @access  Public
const getAllHackathons = async (req, res, next) => {
  try {
    const { search, mode, status, sort } = req.query;

    let query = {};

    // For non-admin public requests, only show published hackathons by default
    if (!req.user || req.user.role !== 'admin') {
      query.isPublished = true;
    }

    // Search by title, theme, venue
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { theme: regex },
        { venue: regex }
      ];
    }

    // Filter by mode
    if (mode && mode !== 'All') {
      query.mode = mode;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest first
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'highestPrize') {
      sortOptions = { prizePool: -1 };
    } else if (sort === 'deadline') {
      sortOptions = { registrationDeadline: 1 };
    }

    const hackathons = await Hackathon.find(query)
      .populate('createdBy', 'name email profileImage role')
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      count: hackathons.length,
      hackathons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hackathon by ID
// @route   GET /api/hackathons/:id
// @access  Public / Private check
const getHackathonById = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('createdBy', 'name email profileImage role');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // If hackathon is not published, check authorization
    if (!hackathon.isPublished) {
      const isOwner = req.user && hackathon.createdBy._id.toString() === req.user._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This hackathon is not yet published.'
        });
      }
    }

    res.status(200).json({
      success: true,
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Private (Organizer Owner / Admin)
const updateHackathon = async (req, res, next) => {
  try {
    let hackathon = req.hackathon; // attached by checkHackathonOwnership middleware

    const {
      title,
      description,
      theme,
      mode,
      venue,
      bannerImage,
      startDate,
      endDate,
      registrationDeadline,
      submissionDeadline,
      prizePool,
      maxTeamSize,
      rules,
      judgingCriteria,
      status,
      isPublished
    } = req.body;

    // Validate maxTeamSize if provided
    if (maxTeamSize !== undefined) {
      const teamSize = Number(maxTeamSize);
      if (teamSize < 2 || teamSize > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum team size must be between 2 and 10'
        });
      }
      hackathon.maxTeamSize = teamSize;
    }

    // Validate dates if any date field updated
    const newStart = startDate || hackathon.startDate;
    const newEnd = endDate || hackathon.endDate;
    const newDeadline = registrationDeadline || hackathon.registrationDeadline;
    const newSubDeadline = submissionDeadline || hackathon.submissionDeadline;

    const dateErrors = validateHackathonDates(newStart, newEnd, newDeadline, newSubDeadline);
    if (dateErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: dateErrors.join(', ')
      });
    }

    if (title) hackathon.title = title;
    if (description) hackathon.description = description;
    if (theme) hackathon.theme = theme;
    if (mode) hackathon.mode = mode;
    if (venue) hackathon.venue = venue;
    if (bannerImage) hackathon.bannerImage = bannerImage;
    if (startDate) hackathon.startDate = startDate;
    if (endDate) hackathon.endDate = endDate;
    if (registrationDeadline) hackathon.registrationDeadline = registrationDeadline;
    if (submissionDeadline) hackathon.submissionDeadline = submissionDeadline;
    if (prizePool !== undefined) hackathon.prizePool = Number(prizePool);
    if (rules) hackathon.rules = rules;
    if (judgingCriteria) hackathon.judgingCriteria = judgingCriteria;
    if (status) hackathon.status = status;
    if (isPublished !== undefined) hackathon.isPublished = Boolean(isPublished);


    const updatedHackathon = await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Hackathon updated successfully',
      hackathon: updatedHackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private (Organizer Owner / Admin)
const deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = req.hackathon;
    await hackathon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hackathons created by logged in organizer
// @route   GET /api/hackathons/my
// @access  Private (Organizer / Admin)
const getMyHackathons = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      hackathons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish / Unpublish hackathon
// @route   PATCH /api/hackathons/:id/publish
// @access  Private (Organizer Owner / Admin)
const publishHackathon = async (req, res, next) => {
  try {
    const hackathon = req.hackathon;
    hackathon.isPublished = true;
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Hackathon published successfully',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Open Registration
// @route   PATCH /api/hackathons/:id/open-registration
// @access  Private (Organizer Owner / Admin)
const openRegistration = async (req, res, next) => {
  try {
    const hackathon = req.hackathon;
    hackathon.status = 'Registration Open';
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Registration is now OPEN',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Close Registration
// @route   PATCH /api/hackathons/:id/close-registration
// @access  Private (Organizer Owner / Admin)
const closeRegistration = async (req, res, next) => {
  try {
    const hackathon = req.hackathon;
    hackathon.status = 'Registration Closed';
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Registration is now CLOSED',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  getMyHackathons,
  publishHackathon,
  openRegistration,
  closeRegistration
};
