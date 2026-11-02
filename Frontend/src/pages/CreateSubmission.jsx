import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { teamService } from '../services/teamService';
import { submissionService } from '../services/submissionService';
import toast from 'react-hot-toast';
import GithubIcon from '../components/GithubIcon';
import { 
  Rocket, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileText, 
  Code2, 
  UploadCloud, 
  Eye, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

import LoadingSpinner from '../components/LoadingSpinner';
import UploadBox from '../components/UploadBox';
import FilePreview from '../components/FilePreview';

const CreateSubmission = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Custom file states
  const [logoFile, setLogoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      techStack: 'React, Node.js, Express, MongoDB',
    },
  });

  const formValues = watch();

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await teamService.getMyTeam();
        if (response.success) {
          setTeams(response.teams || []);
        }
      } catch (err) {
        toast.error('Failed to load active teams');
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchUserTeams();
  }, []);

  const steps = [
    { number: 1, title: 'Project Info' },
    { number: 2, title: 'Tech & Links' },
    { number: 3, title: 'Uploads' },
    { number: 4, title: 'Review & Submit' },
  ];

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['teamId', 'projectName', 'problemStatement', 'solution', 'description'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['githubRepository', 'liveDemoURL', 'techStack', 'demoVideoURL'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === 3 && !pdfFile) {
        toast.error('Presentation PDF upload is required.');
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmitFinal = async (data) => {
    if (!pdfFile) {
      toast.error('Presentation PDF upload is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedTeam = teams.find((t) => t._id === data.teamId);
      if (!selectedTeam) {
        toast.error('Selected team invalid');
        return;
      }

      const formData = new FormData();
      formData.append('teamId', data.teamId);
      formData.append('hackathonId', selectedTeam.hackathon._id);
      formData.append('projectName', data.projectName);
      formData.append('problemStatement', data.problemStatement);
      formData.append('solution', data.solution);
      formData.append('description', data.description);
      formData.append('githubRepository', data.githubRepository);
      formData.append('liveDemoURL', data.liveDemoURL || '');
      formData.append('techStack', data.techStack || '');
      formData.append('demoVideoURL', data.demoVideoURL || '');

      if (pdfFile) formData.append('presentationPDF', pdfFile);
      if (logoFile) formData.append('projectLogo', logoFile);

      screenshotFiles.forEach((file) => {
        formData.append('screenshots', file);
      });

      const response = await submissionService.createSubmission(formData);
      if (response.success) {
        toast.success('Project submission draft created successfully!');
        navigate('/participant/my-submission');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingTeams) {
    return <LoadingSpinner fullScreen label="Loading your teams..." />;
  }

  if (teams.length === 0) {
    return (
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <Rocket className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold text-white">No Active Team Found</h2>
        <p className="text-xs text-slate-400">
          You must be a member or leader of an active team to submit a project.
        </p>
        <button
          onClick={() => navigate('/participant/create-team')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
        >
          Create Team First
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header & Step Wizard Bar */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white">Project Submission Wizard</h1>
          <p className="text-xs text-slate-400">
            Complete the multi-step form to submit your team's hackathon project.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div
                key={step.number}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  isCurrent
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : isCompleted
                    ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-xs font-black">
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
                </span>
                <span className="text-xs font-bold truncate hidden sm:block">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmitFinal)} className="space-y-6">
          {/* STEP 1: Project Information */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Step 1: Project Overview</span>
              </h2>

              {/* Select Team */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Team *
                </label>
                <select
                  {...register('teamId', { required: 'Please select a team' })}
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-slate-900 focus:outline-none ${
                    errors.teamId ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">-- Select Your Team --</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id} className="bg-slate-900 text-white">
                      {t.teamName} ({t.hackathon?.title})
                    </option>
                  ))}
                </select>
                {errors.teamId && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.teamId.message}</p>
                )}
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. HealthPulse AI"
                  {...register('projectName', { required: 'Project name is required' })}
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                    errors.projectName ? 'border-red-500' : ''
                  }`}
                />
                {errors.projectName && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.projectName.message}</p>
                )}
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Problem Statement *
                </label>
                <textarea
                  rows={3}
                  placeholder="What core problem does your project solve?"
                  {...register('problemStatement', { required: 'Problem statement is required' })}
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                    errors.problemStatement ? 'border-red-500' : ''
                  }`}
                />
                {errors.problemStatement && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.problemStatement.message}</p>
                )}
              </div>

              {/* Solution */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Proposed Solution *
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly summarize your innovative solution..."
                  {...register('solution', { required: 'Proposed solution is required' })}
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                    errors.solution ? 'border-red-500' : ''
                  }`}
                />
                {errors.solution && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.solution.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Detailed Project Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Elaborate on architecture, features, and key takeaways..."
                  {...register('description', { required: 'Detailed description is required' })}
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.description.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Technical Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span>Step 2: Code Repository & Live Links</span>
              </h2>

              {/* GitHub Repo */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project-repo"
                  {...register('githubRepository', {
                    required: 'GitHub Repository URL is required',
                    pattern: {
                      value: /^https?:\/\/(www\.)?github\.com\/.+$/,
                      message: 'Must be a valid GitHub URL',
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                    errors.githubRepository ? 'border-red-500' : ''
                  }`}
                />
                {errors.githubRepository && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.githubRepository.message}</p>
                )}
              </div>

              {/* Live Demo URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Live Demo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://myproject.vercel.app"
                  {...register('liveDemoURL')}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                  {...register('techStack')}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>

              {/* Demo Video URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Demo Video URL (Loom / YouTube - Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  {...register('demoVideoURL')}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Uploads */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <span>Step 3: Upload Assets & Deck</span>
              </h2>

              {/* Presentation PDF */}
              <div className="space-y-2">
                <UploadBox
                  label="Presentation Deck (PDF Only) *"
                  accept="application/pdf"
                  onChange={setPdfFile}
                  hint="Upload pitch deck in PDF format (Max 5MB)"
                />
                {pdfFile && <FilePreview file={pdfFile} onRemove={() => setPdfFile(null)} />}
              </div>

              {/* Project Logo */}
              <div className="space-y-2">
                <UploadBox
                  label="Project Logo (Image)"
                  accept="image/*"
                  onChange={setLogoFile}
                  hint="Upload logo image JPG, PNG, WEBP (Max 5MB)"
                />
                {logoFile && <FilePreview file={logoFile} onRemove={() => setLogoFile(null)} />}
              </div>

              {/* Screenshots */}
              <div className="space-y-2">
                <UploadBox
                  label="Screenshots (Multiple allowed - up to 5)"
                  accept="image/*"
                  multiple={true}
                  onChange={(files) => setScreenshotFiles(files)}
                  hint="Upload application screenshots (Max 5MB each)"
                />
                {screenshotFiles.length > 0 && (
                  <div className="space-y-2">
                    {screenshotFiles.map((f, i) => (
                      <FilePreview
                        key={i}
                        file={f}
                        onRemove={() =>
                          setScreenshotFiles((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                <span>Step 4: Final Review</span>
              </h2>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Project Title</span>
                  <span className="text-base font-bold text-white">{formValues.projectName}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 uppercase font-semibold block">GitHub Repository</span>
                    <a
                      href={formValues.githubRepository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 font-mono flex items-center gap-1 underline"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span className="truncate">{formValues.githubRepository}</span>
                    </a>
                  </div>

                  {formValues.liveDemoURL && (
                    <div>
                      <span className="text-slate-500 uppercase font-semibold block">Live Demo</span>
                      <a
                        href={formValues.liveDemoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 font-mono flex items-center gap-1 underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="truncate">{formValues.liveDemoURL}</span>
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Problem Statement</span>
                  <p className="text-slate-300">{formValues.problemStatement}</p>
                </div>

                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Presentation PDF</span>
                  <span className="text-emerald-400 font-semibold">{pdfFile ? pdfFile.name : 'Attached'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div></div>}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" label="" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Draft Submission</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubmission;
