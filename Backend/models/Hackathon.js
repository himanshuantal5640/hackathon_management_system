const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Hackathon title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Hackathon description is required']
    },
    theme: {
      type: String,
      required: [true, 'Hackathon theme is required'],
      trim: true
    },
    mode: {
      type: String,
      required: [true, 'Hackathon mode is required'],
      enum: {
        values: ['Online', 'Offline', 'Hybrid'],
        message: '{VALUE} is not a valid mode'
      },
      default: 'Online'
    },
    venue: {
      type: String,
      required: [true, 'Venue or platform details are required'],
      trim: true
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80'
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    prizePool: {
      type: Number,
      required: [true, 'Prize pool amount is required'],
      min: [0, 'Prize pool cannot be negative']
    },
    maxTeamSize: {
      type: Number,
      required: [true, 'Maximum team size is required'],
      min: [2, 'Maximum team size must be at least 2'],
      max: [10, 'Maximum team size cannot exceed 10']
    },
    rules: {
      type: String,
      required: [true, 'Hackathon rules are required']
    },
    judgingCriteria: {
      type: String,
      required: [true, 'Judging criteria is required']
    },
    status: {
      type: String,
      enum: {
        values: ['Upcoming', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Upcoming'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    resultPublished: {
      type: Boolean,
      default: false
    },
    winnerAnnouncement: {
      type: String,
      default: ''
    },
    firstPrizeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    secondPrizeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    thirdPrizeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    publishedAt: {
      type: Date
    }
  },

  {
    timestamps: true
  }
);

// Indexes for faster search and filtering
hackathonSchema.index({ title: 'text', theme: 'text', venue: 'text' });
hackathonSchema.index({ status: 1, mode: 1, isPublished: 1 });

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

module.exports = Hackathon;
