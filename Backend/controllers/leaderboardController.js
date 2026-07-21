const Leaderboard = require('../models/Leaderboard');
const Hackathon = require('../models/Hackathon');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const Registration = require('../models/Registration');
const { sendNotification } = require('../utils/emailService');

// @desc    Generate automatic leaderboard for a hackathon
// @route   POST /api/leaderboard/generate/:hackathonId
// @access  Private (Organizer / Admin)
const generateLeaderboard = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Fetch all submissions for this hackathon
    const submissions = await Submission.find({ hackathon: hackathonId });

    if (submissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No project submissions found for this hackathon to evaluate'
      });
    }

    // Process reviews for each submission
    const scoredSubmissions = [];

    for (const sub of submissions) {
      const reviews = await Review.find({
        submission: sub._id,
        status: { $in: ['Completed', 'Locked'] }
      });

      const judgeCount = reviews.length;
      const totalSum = reviews.reduce((sum, r) => sum + (r.totalScore || 0), 0);
      const averageScore = judgeCount > 0 ? Number((totalSum / judgeCount).toFixed(2)) : 0;

      scoredSubmissions.push({
        teamId: sub.team,
        submissionId: sub._id,
        totalScore: totalSum,
        averageScore,
        judgeCount
      });
    }

    // Sort descending by averageScore, then totalScore, then judgeCount
    scoredSubmissions.sort((a, b) => {
      if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return b.judgeCount - a.judgeCount;
    });

    // Assign Ranks with Tie-Breaking logic
    let currentRank = 1;
    let entries = [];

    for (let i = 0; i < scoredSubmissions.length; i++) {
      const item = scoredSubmissions[i];

      if (i > 0) {
        const prev = scoredSubmissions[i - 1];
        if (item.averageScore === prev.averageScore) {
          // Tie detected: assign same rank as previous team
          item.rank = prev.rank;
        } else {
          // Next rank skips according to position index + 1
          item.rank = i + 1;
        }
      } else {
        item.rank = 1;
      }

      // Assign position label
      let positionLabel = 'Participant';
      if (item.rank === 1) positionLabel = 'First Place (Winner)';
      else if (item.rank === 2) positionLabel = 'Second Place (Runner-Up)';
      else if (item.rank === 3) positionLabel = 'Third Place (2nd Runner-Up)';
      else if (item.rank <= 10) positionLabel = 'Finalist';

      entries.push({
        hackathon: hackathonId,
        team: item.teamId,
        submission: item.submissionId,
        rank: item.rank,
        totalScore: item.totalScore,
        averageScore: item.averageScore,
        judgeCount: item.judgeCount,
        position: positionLabel
      });
    }

    // Upsert entries into Leaderboard collection
    for (const entry of entries) {
      await Leaderboard.findOneAndUpdate(
        { hackathon: hackathonId, team: entry.team },
        entry,
        { upsert: true, new: true }
      );
    }

    const leaderboard = await Leaderboard.find({ hackathon: hackathonId })
      .populate('team', 'teamName leader members')
      .populate('submission', 'projectName projectLogo githubRepository liveDemoURL')
      .sort({ rank: 1 });

    res.status(200).json({
      success: true,
      message: 'Leaderboard generated successfully with automatic tie detection!',
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Declare winners for a hackathon
// @route   PATCH /api/leaderboard/declare-winners/:hackathonId
// @access  Private (Organizer / Admin)
const declareWinners = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;
    const { firstPrizeTeamId, secondPrizeTeamId, thirdPrizeTeamId, winnerAnnouncement } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    if (firstPrizeTeamId) hackathon.firstPrizeTeam = firstPrizeTeamId;
    if (secondPrizeTeamId) hackathon.secondPrizeTeam = secondPrizeTeamId;
    if (thirdPrizeTeamId) hackathon.thirdPrizeTeam = thirdPrizeTeamId;
    if (winnerAnnouncement !== undefined) hackathon.winnerAnnouncement = winnerAnnouncement;

    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Winners declared successfully!',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish results and announcement to public/participants
// @route   PATCH /api/leaderboard/publish/:hackathonId
// @access  Private (Organizer / Admin)
const publishResults = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    hackathon.resultPublished = true;
    hackathon.publishedAt = new Date();
    await hackathon.save();

    // Trigger Nodemailer background notifications to participants (Async non-blocking)
    Registration.find({ hackathon: hackathonId, status: 'Approved' })
      .populate('participant', 'name email')
      .then((regs) => {
        regs.forEach((r) => {
          if (r.participant?.email) {
            sendNotification.resultsPublished(r.participant.email, r.participant.name, hackathon.title);
          }
        });
      })
      .catch((err) => console.error('Email notification trigger error:', err));

    res.status(200).json({
      success: true,
      message: 'Hackathon results published successfully! Participants notified.',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hide results from public view
// @route   PATCH /api/leaderboard/hide/:hackathonId
// @access  Private (Organizer / Admin)
const hideResults = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    hackathon.resultPublished = false;
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Hackathon results hidden from public view',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard for a hackathon
// @route   GET /api/leaderboard/:hackathonId
// @access  Public (When published) / Private (Organizer/Admin/Judge)
const getLeaderboard = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;
    const { search, page = 1, limit = 20 } = req.query;

    const hackathon = await Hackathon.findById(hackathonId)
      .populate('firstPrizeTeam', 'teamName leader members')
      .populate('secondPrizeTeam', 'teamName leader members')
      .populate('thirdPrizeTeam', 'teamName leader members');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Permission check for unpublished results
    const isElevatedUser = req.user && ['organizer', 'admin', 'judge'].includes(req.user.role);
    if (!hackathon.resultPublished && !isElevatedUser) {
      return res.status(403).json({
        success: false,
        message: 'Results for this hackathon have not been published by the organizer yet.'
      });
    }

    let leaderboard = await Leaderboard.find({ hackathon: hackathonId })
      .populate({
        path: 'team',
        populate: [
          { path: 'leader', select: 'name email profileImage' },
          { path: 'members', select: 'name email profileImage' }
        ]
      })
      .populate({
        path: 'submission',
        populate: [{ path: 'submittedBy', select: 'name email' }]
      })
      .sort({ rank: 1 });

    // Client/query search filter by team name, project name, or leader name
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      leaderboard = leaderboard.filter(
        (e) =>
          (e.team && regex.test(e.team.teamName)) ||
          (e.submission && regex.test(e.submission.projectName)) ||
          (e.team?.leader && regex.test(e.team.leader.name))
      );
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = leaderboard.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      hackathon,
      totalCount: leaderboard.length,
      page: pageNum,
      totalPages: Math.ceil(leaderboard.length / limitNum),
      leaderboard: paginatedItems
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateLeaderboard,
  declareWinners,
  publishResults,
  hideResults,
  getLeaderboard
};
