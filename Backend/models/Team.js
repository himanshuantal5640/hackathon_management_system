const mongoose = require('mongoose');
const crypto = require('crypto');

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [50, 'Team name cannot exceed 50 characters']
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team leader reference is required']
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: [true, 'Hackathon reference is required']
    },
    inviteCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true
    },
    maxMembers: {
      type: Number,
      required: [true, 'Maximum members limit is required'],
      min: [2, 'Maximum team size must be at least 2'],
      max: [10, 'Maximum team size cannot exceed 10']
    },
    status: {
      type: String,
      enum: ['Active', 'Disbanded'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

// Function to generate a random 8-character uppercase alphanumeric code
const generateInviteCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 characters e.g. "A1B2C3D4"
};

// Pre-validate hook to assign inviteCode if not set
teamSchema.pre('validate', function () {
  if (!this.inviteCode) {
    this.inviteCode = generateInviteCode();
  }
});


const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
