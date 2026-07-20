const mongoose = require('mongoose');

const judgeAssignmentSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: [true, 'Hackathon reference is required']
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: [true, 'Submission reference is required']
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Judge user reference is required']
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigner user reference is required']
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate judge assignment for the same submission
judgeAssignmentSchema.index({ submission: 1, judge: 1 }, { unique: true });

const JudgeAssignment = mongoose.model('JudgeAssignment', judgeAssignmentSchema);

module.exports = JudgeAssignment;
