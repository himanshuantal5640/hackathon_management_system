const Leaderboard = require('../models/Leaderboard');
const Hackathon = require('../models/Hackathon');

// @desc    Export Leaderboard as CSV File
// @route   GET /api/export/leaderboard/csv/:hackathonId
// @access  Public (When published) / Private (Organizer/Admin)
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

    const leaderboard = await Leaderboard.find({ hackathon: hackathonId })
      .populate({
        path: 'team',
        populate: [{ path: 'leader', select: 'name email' }]
      })
      .populate('submission', 'projectName')
      .sort({ rank: 1 });

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

// @desc    Export Leaderboard Printable Report HTML / PDF view
// @route   GET /api/export/leaderboard/pdf/:hackathonId
// @access  Public (When published) / Private (Organizer/Admin)
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

    const leaderboard = await Leaderboard.find({ hackathon: hackathonId })
      .populate({
        path: 'team',
        populate: [{ path: 'leader', select: 'name email' }]
      })
      .populate('submission', 'projectName')
      .sort({ rank: 1 });

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
