const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: [true, 'Submission reference is required']
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: [true, 'Hackathon reference is required']
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Judge reference is required']
    },
    innovation: {
      type: Number,
      required: [true, 'Innovation score is required'],
      min: [0, 'Minimum score is 0'],
      max: [10, 'Maximum score is 10']
    },
    technicalComplexity: {
      type: Number,
      required: [true, 'Technical Complexity score is required'],
      min: [0, 'Minimum score is 0'],
      max: [10, 'Maximum score is 10']
    },
    userInterface: {
      type: Number,
      required: [true, 'User Interface score is required'],
      min: [0, 'Minimum score is 0'],
      max: [10, 'Maximum score is 10']
    },
    functionality: {
      type: Number,
      required: [true, 'Functionality score is required'],
      min: [0, 'Minimum score is 0'],
      max: [10, 'Maximum score is 10']
    },
    scalability: {
      type: Number,
      required: [true, 'Scalability score is required'],
      min: [0, 'Minimum score is 0'],
      max: [10, 'Maximum score is 10']
    },
    documentation: {
      type: Number,
      required: [true, 'Documentation score is required'],
      min: [0, 'Minimum score is 0'],
      max: [10, 'Maximum score is 10']
    },
    presentation: {
      type: Number,
      required: [true, 'Presentation score is required'],
      min: [0, 'Minimum score is 0'],
      max: [10, 'Maximum score is 10']
    },
    totalScore: {
      type: Number,
      min: 0,
      max: 70,
      default: 0
    },
    comments: {
      type: String,
      required: [true, 'Review comments are required'],
      trim: true
    },
    strengths: {
      type: String,
      trim: true,
      default: ''
    },
    improvements: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Completed', 'Locked'],
        message: '{VALUE} is not a valid review status'
      },
      default: 'Draft'
    },
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring a judge can review a submission only once
reviewSchema.index({ submission: 1, judge: 1 }, { unique: true });

// Pre-save hook to calculate totalScore out of 70
reviewSchema.pre('save', function (next) {
  this.totalScore =
    (this.innovation || 0) +
    (this.technicalComplexity || 0) +
    (this.userInterface || 0) +
    (this.functionality || 0) +
    (this.scalability || 0) +
    (this.documentation || 0) +
    (this.presentation || 0);

  if (this.status === 'Completed' && !this.submittedAt) {
    this.submittedAt = new Date();
  }

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
