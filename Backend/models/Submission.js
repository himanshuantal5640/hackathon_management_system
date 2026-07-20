const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team reference is required']
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: [true, 'Hackathon reference is required']
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitter user reference is required']
    },
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required']
    },
    solution: {
      type: String,
      required: [true, 'Proposed solution description is required']
    },
    description: {
      type: String,
      required: [true, 'Detailed project description is required']
    },
    githubRepository: {
      type: String,
      required: [true, 'GitHub Repository URL is required'],
      trim: true
    },
    liveDemoURL: {
      type: String,
      trim: true,
      default: ''
    },
    techStack: [
      {
        type: String,
        trim: true
      }
    ],
    presentationPDF: {
      type: String,
      required: [true, 'Presentation PDF upload is required']
    },
    demoVideoURL: {
      type: String,
      trim: true,
      default: ''
    },
    screenshots: [
      {
        type: String
      }
    ],
    projectLogo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid submission status'
      },
      default: 'Draft'
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to ensure each team submits only ONE project per hackathon
submissionSchema.index({ team: 1, hackathon: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
