const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const JudgeAssignment = require('../models/JudgeAssignment');
const Leaderboard = require('../models/Leaderboard');

// @desc    Get Admin System Analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin Only)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrganizers,
      totalJudges,
      totalParticipants,
      totalHackathons,
      completedHackathons,
      totalRegistrations,
      totalTeams,
      totalSubmissions,
      totalReviews
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'organizer' }),
      User.countDocuments({ role: 'judge' }),
      User.countDocuments({ role: 'participant' }),
      Hackathon.countDocuments(),
      Hackathon.countDocuments({ status: 'Completed' }),
      Registration.countDocuments(),
      Team.countDocuments({ status: 'Active' }),
      Submission.countDocuments(),
      Review.countDocuments({ status: { $in: ['Completed', 'Locked'] } })
    ]);

    // Monthly platform registration growth trend for Recharts
    const growthTrend = await Registration.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$registeredAt' } },
          registrations: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 6 }
    ]);

    // Status breakdown for Pie Chart
    const hackathonStatusBreakdown = await Hackathon.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrganizers,
        totalJudges,
        totalParticipants,
        totalHackathons,
        completedHackathons,
        totalRegistrations,
        totalTeams,
        totalSubmissions,
        totalReviews
      },
      growthTrend,
      hackathonStatusBreakdown
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Organizer Analytics
// @route   GET /api/analytics/organizer
// @access  Private (Organizer / Admin)
const getOrganizerAnalytics = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({ createdBy: req.user._id });
    const hackathonIds = hackathons.map(h => h._id);

    const [
      myHackathonsCount,
      registrationsCount,
      approvedTeamsCount,
      submissionsCount,
      completedReviewsCount
    ] = await Promise.all([
      Hackathon.countDocuments({ createdBy: req.user._id }),
      Registration.countDocuments({ hackathon: { $in: hackathonIds } }),
      Registration.countDocuments({ hackathon: { $in: hackathonIds }, status: 'Approved' }),
      Submission.countDocuments({ hackathon: { $in: hackathonIds } }),
      Review.countDocuments({ hackathon: { $in: hackathonIds }, status: { $in: ['Completed', 'Locked'] } })
    ]);

    // Calculate Average Score across organizer's hackathons
    const reviewAgg = await Review.aggregate([
      { $match: { hackathon: { $in: hackathonIds }, status: { $in: ['Completed', 'Locked'] } } },
      { $group: { _id: null, avgScore: { $avg: '$totalScore' } } }
    ]);
    const avgScore = reviewAgg.length > 0 ? Number(reviewAgg[0].avgScore.toFixed(1)) : 0;

    // Registration trend per hackathon for Bar Chart
    const registrationsPerHackathon = await Registration.aggregate([
      { $match: { hackathon: { $in: hackathonIds } } },
      {
        $group: {
          _id: '$hackathon',
          registrations: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'hackathons',
          localField: '_id',
          foreignField: '_id',
          as: 'hackathonDetails'
        }
      },
      { $unwind: '$hackathonDetails' },
      {
        $project: {
          title: '$hackathonDetails.title',
          registrations: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        myHackathons: myHackathonsCount,
        registrations: registrationsCount,
        approvedTeams: approvedTeamsCount,
        submissions: submissionsCount,
        completedReviews: completedReviewsCount,
        averageScore: avgScore
      },
      registrationsPerHackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Judge Analytics
// @route   GET /api/analytics/judge
// @access  Private (Judge / Admin)
const getJudgeAnalytics = async (req, res, next) => {
  try {
    const [assignedCount, reviews] = await Promise.all([
      JudgeAssignment.countDocuments({ judge: req.user._id }),
      Review.find({ judge: req.user._id })
    ]);

    const completedReviews = reviews.filter(r => r.status === 'Completed' || r.status === 'Locked');
    const completedCount = completedReviews.length;
    const pendingCount = Math.max(0, assignedCount - completedCount);

    const avgScore =
      completedCount > 0
        ? Number(
            (completedReviews.reduce((sum, r) => sum + r.totalScore, 0) / completedCount).toFixed(1)
          )
        : 0;

    // 7 Criteria Radar Chart averages
    const radarMetrics = [
      { criteria: 'Innovation', score: Number((completedReviews.reduce((sum, r) => sum + r.innovation, 0) / (completedCount || 1)).toFixed(1)) },
      { criteria: 'Technical', score: Number((completedReviews.reduce((sum, r) => sum + r.technicalComplexity, 0) / (completedCount || 1)).toFixed(1)) },
      { criteria: 'UI / UX', score: Number((completedReviews.reduce((sum, r) => sum + r.userInterface, 0) / (completedCount || 1)).toFixed(1)) },
      { criteria: 'Functionality', score: Number((completedReviews.reduce((sum, r) => sum + r.functionality, 0) / (completedCount || 1)).toFixed(1)) },
      { criteria: 'Scalability', score: Number((completedReviews.reduce((sum, r) => sum + r.scalability, 0) / (completedCount || 1)).toFixed(1)) },
      { criteria: 'Docs', score: Number((completedReviews.reduce((sum, r) => sum + r.documentation, 0) / (completedCount || 1)).toFixed(1)) },
      { criteria: 'Presentation', score: Number((completedReviews.reduce((sum, r) => sum + r.presentation, 0) / (completedCount || 1)).toFixed(1)) }
    ];

    res.status(200).json({
      success: true,
      stats: {
        assignedProjects: assignedCount,
        completedReviews: completedCount,
        pendingReviews: pendingCount,
        averageScoreGiven: avgScore
      },
      radarMetrics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Participant Analytics
// @route   GET /api/analytics/participant
// @access  Private (Participant / Admin)
const getParticipantAnalytics = async (req, res, next) => {
  try {
    const [registrations, teams] = await Promise.all([
      Registration.find({ participant: req.user._id }),
      Team.find({ members: req.user._id, status: 'Active' })
    ]);

    const registeredCount = registrations.filter(r => r.status !== 'Cancelled').length;
    const teamIds = teams.map(t => t._id);

    const submissions = await Submission.find({ team: { $in: teamIds } });
    const submissionCount = submissions.length;

    // Find best leaderboard rank
    const leaderboards = await Leaderboard.find({ team: { $in: teamIds } }).sort({ rank: 1 });
    const bestRank = leaderboards.length > 0 ? leaderboards[0].rank : 'N/A';
    const positionLabel = leaderboards.length > 0 ? leaderboards[0].position : 'N/A';

    res.status(200).json({
      success: true,
      stats: {
        registeredHackathons: registeredCount,
        activeTeams: teams.length,
        submissionsCount: submissionCount,
        bestRank,
        positionLabel
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminAnalytics,
  getOrganizerAnalytics,
  getJudgeAnalytics,
  getParticipantAnalytics
};
