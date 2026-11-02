import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionService } from '../services/submissionService';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';
import TechStackBadge from '../components/TechStackBadge';
import PDFViewer from '../components/PDFViewer';
import ProjectGallery from '../components/ProjectGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import GithubIcon from '../components/GithubIcon';
import { ArrowLeft, ExternalLink, Calendar, Users, Rocket } from 'lucide-react';


const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await submissionService.getSubmissionById(id);
        if (response.success) {
          setSubmission(response.submission);
        }
      } catch (err) {
        toast.error('Failed to load submission details');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading project submission details..." />;
  }

  if (!submission) return null;

  const {
    projectName,
    problemStatement,
    solution,
    description,
    githubRepository,
    liveDemoURL,
    techStack,
    presentationPDF,
    demoVideoURL,
    screenshots,
    projectLogo,
    status,
    submissionDate,
    team,
    hackathon,
    submittedBy,
  } = submission;

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

      {/* Main Container */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <img
              src={
                projectLogo ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
              }
              alt={projectName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-2xl"
            />
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                {hackathon?.title}
              </span>
              <h1 className="text-3xl font-extrabold text-white">{projectName}</h1>
              <p className="text-xs text-slate-400">Submitted by {submittedBy?.name}</p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusBadge status={status} />
            <span className="text-xs text-slate-400 font-mono">
              Submitted {new Date(submissionDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Links Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {githubRepository && (
            <a
              href={githubRepository}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <GithubIcon className="w-4 h-4 text-indigo-400" />
              <span>GitHub Repository</span>
            </a>
          )}

          {liveDemoURL && (
            <a
              href={liveDemoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Built With:
            </span>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, idx) => (
                <TechStackBadge key={idx} name={tech} />
              ))}
            </div>
          </div>
        )}

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">
              Problem Statement
            </span>
            <p className="text-slate-200 leading-relaxed">{problemStatement}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">
              Proposed Solution
            </span>
            <p className="text-slate-200 leading-relaxed">{solution}</p>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Detailed Project Description
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            {description}
          </p>
        </div>

        {/* PDF Presentation */}
        {presentationPDF && <PDFViewer pdfUrl={presentationPDF} />}

        {/* Gallery */}
        {screenshots && screenshots.length > 0 && (
          <ProjectGallery screenshots={screenshots} />
        )}
      </div>
    </div>
  );
};

export default SubmissionDetails;
