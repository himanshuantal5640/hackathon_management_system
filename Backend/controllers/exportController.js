const Leaderboard = require('../models/Leaderboard');
const Hackathon = require('../models/Hackathon');

// Helper to generate dynamic leaderboard on the fly if frozen leaderboard is not yet generated
const getRealtimeLeaderboard = async (hackathonId) => {
  const Submission = require('../models/Submission');
  const Review = require('../models/Review');
  
  const submissions = await Submission.find({ hackathon: hackathonId })
    .populate({
      path: 'team',
      populate: [{ path: 'leader', select: 'name email' }]
    });

  const scoredSubmissions = [];

  for (const sub of submissions) {
    // Include all reviews (including drafts / completed) for live reporting
    const reviews = await Review.find({ submission: sub._id });
    const judgeCount = reviews.length;
    const totalSum = reviews.reduce((sum, r) => sum + (r.totalScore || 0), 0);
    const averageScore = judgeCount > 0 ? Number((totalSum / judgeCount).toFixed(2)) : 0;

    scoredSubmissions.push({
      team: sub.team,
      submission: { _id: sub._id, projectName: sub.projectName },
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

  return scoredSubmissions.map((item, index) => {
    const rank = index + 1;
    let position = 'Participant';
    if (rank === 1) position = 'First Place';
    else if (rank === 2) position = 'Second Place';
    else if (rank === 3) position = 'Third Place';
    return {
      rank,
      team: item.team,
      submission: item.submission,
      averageScore: item.averageScore,
      judgeCount: item.judgeCount,
      position
    };
  });
};

const exportLeaderboardCSV = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    let leaderboard = await Leaderboard.find({ hackathon: hackathonId })
      .populate({
        path: 'team',
        populate: [{ path: 'leader', select: 'name email' }]
      })
      .populate('submission', 'projectName')
      .sort({ rank: 1 });

    // Fallback to real-time calculation if leaderboard is not officially generated/published
    if (leaderboard.length === 0) {
      leaderboard = await getRealtimeLeaderboard(hackathonId);
    }

    // Construct CSV Header & Rows
    let csvContent = 'Rank,Team Name,Project Name,Leader Name,Leader Email,Average Score (70),Judge Count,Position\n';

    leaderboard.forEach((item) => {
      const rank = item.rank;
      const teamName = `"${(item.team?.teamName || '').replace(/"/g, '""')}"`;
      const projectName = `"${(item.submission?.projectName || '').replace(/"/g, '""')}"`;
      const leaderName = `"${(item.team?.leader?.name || '').replace(/"/g, '""')}"`;
      const leaderEmail = `"${(item.team?.leader?.email || '').replace(/"/g, '""')}"`;
      const avgScore = item.averageScore;
      const judgeCount = item.judgeCount;
      const position = `"${(item.position || '').replace(/"/g, '""')}"`;

      csvContent += `${rank},${teamName},${projectName},${leaderName},${leaderEmail},${avgScore},${judgeCount},${position}\n`;
    });

    const filename = `Leaderboard_${hackathon.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};


const exportLeaderboardPDF = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    let leaderboard = await Leaderboard.find({ hackathon: hackathonId })
      .populate({
        path: 'team',
        populate: [{ path: 'leader', select: 'name email' }]
      })
      .populate('submission', 'projectName')
      .sort({ rank: 1 });

    // Fallback to real-time calculation if leaderboard is not officially generated/published
    if (leaderboard.length === 0) {
      leaderboard = await getRealtimeLeaderboard(hackathonId);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Leaderboard Report - ${hackathon.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; background: #fff; color: #111; }
          h1 { color: #4f46e5; font-size: 24px; margin-bottom: 5px; }
          p { font-size: 14px; color: #555; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f3f4f6; color: #374151; font-weight: bold; }
          .rank-1 { background: #fef3c7; font-weight: bold; }
          .rank-2 { background: #f3f4f6; }
          .rank-3 { background: #ffedd5; }
          .footer { margin-top: 30px; font-size: 11px; color: #888; text-align: center; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
            Print / Save as PDF
          </button>
        </div>

        <h1>${hackathon.title} - Official Leaderboard Report</h1>
        <p>Theme: ${hackathon.theme} | Venue: ${hackathon.venue} | Generated on: ${new Date().toLocaleDateString()}</p>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team Name</th>
              <th>Project Name</th>
              <th>Team Leader</th>
              <th>Avg Score (out of 70)</th>
              <th>Judges</th>
              <th>Standing Position</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboard
              .map(
                (item) => `
              <tr class="rank-${item.rank}">
                <td>#${item.rank}</td>
                <td>${item.team?.teamName || 'N/A'}</td>
                <td>${item.submission?.projectName || 'N/A'}</td>
                <td>${item.team?.leader?.name || 'N/A'} (${item.team?.leader?.email || ''})</td>
                <td>${item.averageScore} / 70</td>
                <td>${item.judgeCount} Judges</td>
                <td>${item.position}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>HackPulse Platform Official Hackathon Report - Generated Automatically</p>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportLeaderboardCSV,
  exportLeaderboardPDF
};
