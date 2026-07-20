const JudgeAssignment = require('../models/JudgeAssignment');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Assign a judge to a project submission
// @route   POST /api/reviews/assign
// @access  Private (Organizer / Admin)
const assignJudge = async (req, res, next) => {
  try {
    const { submissionId, judgeId, hackathonId } = req.body;

    if (!submissionId || !judgeId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both submissionId and judgeId'
      });
    }

    // Check Submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check Judge user
    const judge = await User.findById(judgeId);
    if (!judge || (judge.role !== 'judge' && judge.role !== 'admin')) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must have the "judge" or "admin" role'
      });
    }

    // Check for duplicate assignment
    const existingAssignment = await JudgeAssignment.findOne({
      submission: submissionId,
      judge: judgeId
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: 'This judge is already assigned to evaluate this submission'
      });
    }

    const targetHackathonId = hackathonId || submission.hackathon;

    const assignment = await JudgeAssignment.create({
      hackathon: targetHackathonId,
      submission: submissionId,
      judge: judgeId,
      assignedBy: req.user._id
    });

    const populatedAssignment = await JudgeAssignment.findById(assignment._id)
      .populate('judge', 'name email profileImage role')
      .populate('submission', 'projectName projectLogo status')
      .populate('hackathon', 'title');

    res.status(201).json({
      success: true,
      message: `Successfully assigned judge ${judge.name} to project submission`,
      assignment: populatedAssignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignments for logged-in judge
// @route   GET /api/reviews/assignments
// @access  Private (Judge / Admin)
const getJudgeAssignments = async (req, res, next) => {
  try {
    const { hackathonId } = req.query;

    let query = {};
    if (req.user.role === 'judge') {
      query.judge = req.user._id;
    }
    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    const assignments = await JudgeAssignment.find(query)
      .populate({
        path: 'submission',
        populate: [
          { path: 'team', select: 'teamName leader members' },
          { path: 'submittedBy', select: 'name email profileImage' }
        ]
      })
      .populate('hackathon', 'title theme mode registrationDeadline endDate')
      .populate('judge', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all judges in the system
// @route   GET /api/reviews/judges
// @access  Private (Organizer / Admin)
const getAvailableJudges = async (req, res, next) => {
  try {
    const judges = await User.find({ role: { $in: ['judge', 'admin'] } }).select(
      'name email profileImage role createdAt'
    );

    res.status(200).json({
      success: true,
      count: judges.length,
      judges
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignJudge,
  getJudgeAssignments,
  getAvailableJudges
};
