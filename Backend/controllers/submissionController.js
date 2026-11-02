const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const Registration = require('../models/Registration');

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};


const createSubmission = async (req, res, next) => {
  try {
    const {
      teamId,
      hackathonId,
      projectName,
      problemStatement,
      solution,
      description,
      githubRepository,
      liveDemoURL,
      techStack,
      demoVideoURL
    } = req.body;

    // Validate Required Fields
    if (!teamId || !hackathonId || !projectName || !problemStatement || !solution || !description || !githubRepository) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required text fields: Team, Hackathon, Project Name, Problem Statement, Solution, Description, and GitHub URL'
      });
    }

    // Validate GitHub URL
    if (!isValidUrl(githubRepository)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid GitHub Repository URL'
      });
    }

    if (liveDemoURL && !isValidUrl(liveDemoURL)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Live Demo URL'
      });
    }

    const team = await Team.findById(teamId);
    if (!team || team.status === 'Disbanded') {
      return res.status(404).json({
        success: false,
        message: 'Team not found or has been disbanded'
      });
    }

    // Leader validation
    if (team.leader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the team leader can submit a project.'
      });
    }

    // Check Hackathon Deadline
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    const deadline = new Date(hackathon.endDate || hackathon.registrationDeadline);
    if (new Date() > deadline) {
      return res.status(400).json({
        success: false,
        message: 'Submission deadline for this hackathon has passed.'
      });
    }

    // Check if Team Registration is Approved or Pending
    const reg = await Registration.findOne({
      hackathon: hackathonId,
      $or: [{ participant: req.user._id }, { team: teamId }],
      status: { $in: ['Approved', 'Pending'] }
    });

    if (!reg && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only teams with a registered hackathon entry can submit projects.'
      });
    }


    // Prevent duplicate submission per team per hackathon
    const existingSubmission = await Submission.findOne({ team: teamId, hackathon: hackathonId });
    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: 'Your team has already created a submission for this hackathon.'
      });
    }

    // File Upload Paths
    let presentationPDFPath = '';
    let projectLogoPath = '';
    let screenshotsPaths = [];

    if (req.files) {
      if (req.files.presentationPDF && req.files.presentationPDF.length > 0) {
        presentationPDFPath = `/uploads/${req.files.presentationPDF[0].filename}`;
      }
      if (req.files.projectLogo && req.files.projectLogo.length > 0) {
        projectLogoPath = `/uploads/${req.files.projectLogo[0].filename}`;
      }
      if (req.files.screenshots && req.files.screenshots.length > 0) {
        screenshotsPaths = req.files.screenshots.map(f => `/uploads/${f.filename}`);
      }
    }

    if (!presentationPDFPath) {
      return res.status(400).json({
        success: false,
        message: 'Presentation PDF upload is required.'
      });
    }

    // Parse Tech Stack tags
    let techStackArray = [];
    if (techStack) {
      if (Array.isArray(techStack)) {
        techStackArray = techStack;
      } else if (typeof techStack === 'string') {
        techStackArray = techStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const submission = await Submission.create({
      team: teamId,
      hackathon: hackathonId,
      submittedBy: req.user._id,
      projectName,
      problemStatement,
      solution,
      description,
      githubRepository,
      liveDemoURL: liveDemoURL || '',
      techStack: techStackArray,
      presentationPDF: presentationPDFPath,
      demoVideoURL: demoVideoURL || '',
      screenshots: screenshotsPaths,
      projectLogo: projectLogoPath || undefined,
      status: 'Draft'
    });

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('team', 'teamName inviteCode members')
      .populate('hackathon', 'title mode venue')
      .populate('submittedBy', 'name email profileImage');

    res.status(201).json({
      success: true,
      message: 'Project submission draft created successfully!',
      submission: populatedSubmission
    });
  } catch (error) {
    next(error);
  }
};

const updateSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('hackathon');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Leader permission check
    if (submission.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the team leader can edit the project submission.'
      });
    }

    // Deadline check
    const deadline = new Date(submission.hackathon.endDate || submission.hackathon.registrationDeadline);
    if (new Date() > deadline && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Submission deadline has passed. Edits are no longer permitted.'
      });
    }

    const {
      projectName,
      problemStatement,
      solution,
      description,
      githubRepository,
      liveDemoURL,
      techStack,
      demoVideoURL
    } = req.body;

    if (projectName) submission.projectName = projectName;
    if (problemStatement) submission.problemStatement = problemStatement;
    if (solution) submission.solution = solution;
    if (description) submission.description = description;
    if (githubRepository) submission.githubRepository = githubRepository;
    if (liveDemoURL !== undefined) submission.liveDemoURL = liveDemoURL;
    if (demoVideoURL !== undefined) submission.demoVideoURL = demoVideoURL;

    if (techStack) {
      if (Array.isArray(techStack)) {
        submission.techStack = techStack;
      } else if (typeof techStack === 'string') {
        submission.techStack = techStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Handle File Updates if uploaded
    if (req.files) {
      if (req.files.presentationPDF && req.files.presentationPDF.length > 0) {
        submission.presentationPDF = `/uploads/${req.files.presentationPDF[0].filename}`;
      }
      if (req.files.projectLogo && req.files.projectLogo.length > 0) {
        submission.projectLogo = `/uploads/${req.files.projectLogo[0].filename}`;
      }
      if (req.files.screenshots && req.files.screenshots.length > 0) {
        submission.screenshots = req.files.screenshots.map(f => `/uploads/${f.filename}`);
      }
    }

    submission.lastUpdated = new Date();
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully',
      submission
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the team leader can delete the submission.'
      });
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('team', 'teamName inviteCode members leader')
      .populate('hackathon', 'title theme mode venue endDate registrationDeadline')
      .populate('submittedBy', 'name email profileImage');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    next(error);
  }
};

const getMySubmission = async (req, res, next) => {
  try {
    const { hackathonId } = req.query;

    // Find active teams of the user
    const teams = await Team.find({ members: req.user._id, status: 'Active' });
    const teamIds = teams.map(t => t._id);

    let query = { team: { $in: teamIds } };
    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    const submissions = await Submission.find(query)
      .populate('team', 'teamName inviteCode members leader')
      .populate('hackathon', 'title theme mode venue registrationDeadline')
      .populate('submittedBy', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

const getHackathonSubmissions = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let query = { hackathon: req.params.hackathonId };

    if (status && status !== 'All') {
      query.status = status;
    }

    let submissions = await Submission.find(query)
      .populate('team', 'teamName inviteCode members leader')
      .populate('hackathon', 'title theme mode venue')
      .populate('submittedBy', 'name email profileImage')
      .sort({ createdAt: -1 });

    // Client/query search by project name or team name
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      submissions = submissions.filter(s => 
        regex.test(s.projectName) || (s.team && regex.test(s.team.teamName)) || (s.submittedBy && regex.test(s.submittedBy.name))
      );
    }

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

const submitProject = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('hackathon');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the team leader can finalize submission.'
      });
    }

    const deadline = new Date(submission.hackathon.endDate || submission.hackathon.registrationDeadline);
    if (new Date() > deadline && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Submission deadline has passed. Cannot submit.'
      });
    }

    submission.status = 'Submitted';
    submission.submissionDate = new Date();
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Project finalized and submitted successfully!',
      submission
    });
  } catch (error) {
    next(error);
  }
};

const changeSubmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.status = status;
    await submission.save();

    res.status(200).json({
      success: true,
      message: `Submission status updated to ${status}`,
      submission
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionById,
  getMySubmission,
  getHackathonSubmissions,
  submitProject,
  changeSubmissionStatus
};
