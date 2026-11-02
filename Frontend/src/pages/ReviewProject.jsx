import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionService } from '../services/submissionService';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';
import ScoreInput from '../components/ScoreInput';
import PDFViewer from '../components/PDFViewer';
import ProjectGallery from '../components/ProjectGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import GithubIcon from '../components/GithubIcon';
import { 
  Award, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Sparkles,
  MessageSquare,
  ThumbsUp,
  TrendingUp
} from 'lucide-react';


const ReviewProject = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 7 Scoring Criteria State (0 to 10)
  const [innovation, setInnovation] = useState(7);
  const [technicalComplexity, setTechnicalComplexity] = useState(7);
  const [userInterface, setUserInterface] = useState(7);
  const [functionality, setFunctionality] = useState(7);
  const [scalability, setScalability] = useState(7);
  const [documentation, setDocumentation] = useState(7);
  const [presentation, setPresentation] = useState(7);

  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  // Auto-calculated Total Score out of 70
  const totalScore =
    Number(innovation) +
    Number(technicalComplexity) +
    Number(userInterface) +
    Number(functionality) +
    Number(scalability) +
    Number(documentation) +
    Number(presentation);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subRes, revRes] = await Promise.all([
          submissionService.getSubmissionById(submissionId),
          reviewService.getSubmissionReviews(submissionId),
        ]);

        if (subRes.success) setSubmission(subRes.submission);

        if (revRes.success && revRes.reviews.length > 0) {
          // Find if logged-in judge already created a review
          const myRev = revRes.reviews[0];
          setExistingReview(myRev);
          setInnovation(myRev.innovation || 7);
          setTechnicalComplexity(myRev.technicalComplexity || 7);
          setUserInterface(myRev.userInterface || 7);
          setFunctionality(myRev.functionality || 7);
          setScalability(myRev.scalability || 7);
          setDocumentation(myRev.documentation || 7);
          setPresentation(myRev.presentation || 7);
          setComments(myRev.comments || '');
          setStrengths(myRev.strengths || '');
          setImprovements(myRev.improvements || '');
        }
      } catch (err) {
        toast.error('Failed to load project details or evaluation');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [submissionId]);

  const handleSave = async (statusToSet = 'Draft') => {
    if (!comments || comments.trim().length === 0) {
      toast.error('Please provide evaluation comments/feedback');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        submissionId,
        hackathonId: submission.hackathon._id,
        innovation,
        technicalComplexity,
        userInterface,
        functionality,
        scalability,
        documentation,
        presentation,
        comments: comments.trim(),
        strengths: strengths.trim(),
        improvements: improvements.trim(),
        status: statusToSet,
      };

      let response;
      if (existingReview) {
        response = await reviewService.updateReview(existingReview._id, payload);
      } else {
        response = await reviewService.createReview(payload);
      }

      if (response.success) {
        toast.success(
          statusToSet === 'Completed'
            ? 'Evaluation submitted successfully!'
            : 'Review draft saved!'
        );
        navigate('/judge/completed-reviews');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading project submission for review..." />;
  }

  if (!submission) return null;

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Project Overview Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <img
              src={
                submission.projectLogo ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
              }
              alt={submission.projectName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
            />
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                {submission.hackathon?.title}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {submission.projectName}
              </h1>
              <p className="text-xs text-slate-400">Team: {submission.team?.teamName}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-2">
            {submission.githubRepository && (
              <a
                href={submission.githubRepository}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <GithubIcon className="w-4 h-4 text-indigo-400" />
                <span>GitHub</span>
              </a>
            )}
            {submission.liveDemoURL && (
              <a
                href={submission.liveDemoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        {/* Problem & Solution Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Problem Statement
            </span>
            <p className="text-slate-300 leading-relaxed">{submission.problemStatement}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Proposed Solution
            </span>
            <p className="text-slate-300 leading-relaxed">{submission.solution}</p>
          </div>
        </div>

        {/* Pitch Deck PDF */}
        {submission.presentationPDF && <PDFViewer pdfUrl={submission.presentationPDF} />}

        {/* Screenshots */}
        {submission.screenshots && submission.screenshots.length > 0 && (
          <ProjectGallery screenshots={submission.screenshots} />
        )}
      </div>

      {/* Evaluation Form Panel */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 space-y-8 shadow-2xl relative">
        {/* Sticky Total Score Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border border-indigo-500/40 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Scoring Rubric (7 Criteria)</span>
            </div>
            <h2 className="text-xl font-black text-white">Live Total Score Calculation</h2>
          </div>

          <div className="px-6 py-3 rounded-2xl bg-slate-950 border border-indigo-500/40 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase block">
              Combined Score
            </span>
            <span className="text-3xl font-black text-indigo-300 font-mono">
              {totalScore} <span className="text-sm text-slate-500 font-normal">/ 70</span>
            </span>
          </div>
        </div>

        {/* 7 Scoring Inputs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Evaluation Criteria (0 to 10 points each)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreInput
              label="Innovation & Originality"
              description="Uniqueness and creativity of the idea"
              value={innovation}
              onChange={setInnovation}
            />

            <ScoreInput
              label="Technical Complexity"
              description="Sophistication and depth of technology"
              value={technicalComplexity}
              onChange={setTechnicalComplexity}
            />

            <ScoreInput
              label="User Interface & UX"
              description="Visual design, responsiveness, and usability"
              value={userInterface}
              onChange={setUserInterface}
            />

            <ScoreInput
              label="Functionality & Execution"
              description="How well features work without bugs"
              value={functionality}
              onChange={setFunctionality}
            />

            <ScoreInput
              label="Scalability & Impact"
              description="Potential for growth and real-world utility"
              value={scalability}
              onChange={setScalability}
            />

            <ScoreInput
              label="Documentation & Code Quality"
              description="Repository README, code structure, comments"
              value={documentation}
              onChange={setDocumentation}
            />

            <ScoreInput
              label="Presentation & Pitch Deck"
              description="Clarity of pitch slides and video demo"
              value={presentation}
              onChange={setPresentation}
            />
          </div>
        </div>

        {/* Feedback Text Fields */}
        <div className="space-y-5 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Qualitative Feedback & Remarks
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              General Review Comments *
            </label>
            <textarea
              rows={4}
              placeholder="Provide constructive feedback for the team..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                Key Strengths
              </label>
              <textarea
                rows={3}
                placeholder="What stood out about this project?"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Areas for Improvement
              </label>
              <textarea
                rows={3}
                placeholder="What could be improved?"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* CTA Action Buttons */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('Draft')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('Completed')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <LoadingSpinner size="sm" label="" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Final Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewProject;
