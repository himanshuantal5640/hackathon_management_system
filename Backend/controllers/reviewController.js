const Review = require('../models/Review');
const JudgeAssignment = require('../models/JudgeAssignment');
const Submission = require('../models/Submission');

// @desc    Create a project review evaluation (Draft or Completed)
// @route   POST /api/reviews
// @access  Private (Judge / Admin)
const createReview = async (req, res, next) => {
  try {
    const {
      submissionId,
      hackathonId,
      innovation,
      technicalComplexity,
      userInterface,
      functionality,
      scalability,
      documentation,
      presentation,
      comments,
      strengths,
      improvements,
      status // 'Draft' or 'Completed'
    } = req.body;

    if (!submissionId || !comments) {
      return res.status(400).json({
        success: false,
        message: 'Submission reference and comments are required'
      });
    }

    // Verify Submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Business Rule: Check if Judge is assigned to this submission
    if (req.user.role !== 'admin') {
      const assignment = await JudgeAssignment.findOne({
        submission: submissionId,
        judge: req.user._id
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You are not assigned to evaluate this submission.'
        });
      }
    }

    // Prevent duplicate review by the same judge
    const existingReview = await Review.findOne({
      submission: submissionId,
      judge: req.user._id
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already evaluated or drafted a review for this submission. Please edit your existing review.',
        reviewId: existingReview._id
      });
    }

    // Validate score ranges (0 to 10)
    const scores = [
      Number(innovation || 0),
      Number(technicalComplexity || 0),
      Number(userInterface || 0),
      Number(functionality || 0),
      Number(scalability || 0),
      Number(documentation || 0),
      Number(presentation || 0)
    ];

    for (const s of scores) {
      if (isNaN(s) || s < 0 || s > 10) {
        return res.status(400).json({
          success: false,
          message: 'All score criteria must be numbers between 0 and 10'
        });
      }
    }

    const review = new Review({
      submission: submissionId,
      hackathon: hackathonId || submission.hackathon,
      judge: req.user._id,
      innovation: Number(innovation || 0),
      technicalComplexity: Number(technicalComplexity || 0),
      userInterface: Number(userInterface || 0),
      functionality: Number(functionality || 0),
      scalability: Number(scalability || 0),
      documentation: Number(documentation || 0),
      presentation: Number(presentation || 0),
      comments,
      strengths: strengths || '',
      improvements: improvements || '',
      status: status === 'Completed' ? 'Completed' : 'Draft'
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('submission', 'projectName projectLogo')
      .populate('hackathon', 'title')
      .populate('judge', 'name email profileImage');

    res.status(201).json({
      success: true,
      message: status === 'Completed' ? 'Evaluation submitted successfully!' : 'Evaluation draft saved!',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review evaluation draft
// @route   PUT /api/reviews/:id
// @access  Private (Judge / Admin)
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Judge ownership check
    if (review.judge.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit your own reviews.'
      });
    }

    // Business Rule: Locked or Completed reviews cannot be edited by judges
    if (review.status === 'Locked') {
      return res.status(400).json({
        success: false,
        message: 'This review has been LOCKED by the organizer and cannot be edited.'
      });
    }

    if (review.status === 'Completed' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Submitted evaluations cannot be edited. Contact an organizer to unlock.'
      });
    }

    const {
      innovation,
      technicalComplexity,
      userInterface,
      functionality,
      scalability,
      documentation,
      presentation,
      comments,
      strengths,
      improvements,
      status
    } = req.body;

    if (innovation !== undefined) review.innovation = Number(innovation);
    if (technicalComplexity !== undefined) review.technicalComplexity = Number(technicalComplexity);
    if (userInterface !== undefined) review.userInterface = Number(userInterface);
    if (functionality !== undefined) review.functionality = Number(functionality);
    if (scalability !== undefined) review.scalability = Number(scalability);
    if (documentation !== undefined) review.documentation = Number(documentation);
    if (presentation !== undefined) review.presentation = Number(presentation);
    if (comments) review.comments = comments;
    if (strengths !== undefined) review.strengths = strengths;
    if (improvements !== undefined) review.improvements = improvements;

    if (status && ['Draft', 'Completed'].includes(status)) {
      review.status = status;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit evaluation (Change status to Completed)
// @route   PATCH /api/reviews/:id/submit
// @access  Private (Judge / Admin)
const submitReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.judge.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    if (review.status === 'Locked') {
      return res.status(400).json({
        success: false,
        message: 'This review is locked and cannot be modified.'
      });
    }

    review.status = 'Completed';
    review.submittedAt = new Date();
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Evaluation submitted successfully!',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock review (Organizer / Admin)
// @route   PATCH /api/reviews/:id/lock
// @access  Private (Organizer / Admin)
const lockReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'Locked';
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review evaluation locked successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a single submission
// @route   GET /api/reviews/submission/:submissionId
// @access  Private
const getSubmissionReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ submission: req.params.submissionId })
      .populate('judge', 'name email profileImage role')
      .populate('submission', 'projectName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews evaluated by logged-in judge
// @route   GET /api/reviews/judge
// @access  Private (Judge / Admin)
const getJudgeReviews = async (req, res, next) => {
  try {
    const { status, hackathonId } = req.query;

    let query = {};
    if (req.user.role === 'judge') {
      query.judge = req.user._id;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    const reviews = await Review.find(query)
      .populate({
        path: 'submission',
        populate: [
          { path: 'team', select: 'teamName leader' },
          { path: 'submittedBy', select: 'name email profileImage' }
        ]
      })
      .populate('hackathon', 'title mode')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Private
const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'submission',
        populate: [
          { path: 'team', select: 'teamName leader members' },
          { path: 'submittedBy', select: 'name email profileImage' }
        ]
      })
      .populate('hackathon', 'title mode theme')
      .populate('judge', 'name email profileImage role');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review evaluation not found'
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  updateReview,
  submitReview,
  lockReview,
  getSubmissionReviews,
  getJudgeReviews,
  getReviewById
};
