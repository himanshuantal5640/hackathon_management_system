const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: [true, 'Hackathon reference is required']
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team reference is required']
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: [true, 'Submission reference is required']
    },
    rank: {
      type: Number,
      required: [true, 'Rank position is required']
    },
    totalScore: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      required: [true, 'Average score is required'],
      default: 0
    },
    judgeCount: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      default: 'Participant'
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring one leaderboard entry per team per hackathon
leaderboardSchema.index({ hackathon: 1, team: 1 }, { unique: true });
leaderboardSchema.index({ hackathon: 1, rank: 1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
