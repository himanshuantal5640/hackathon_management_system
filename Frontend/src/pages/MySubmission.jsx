import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submissionService } from '../services/submissionService';
import toast from 'react-hot-toast';
import GithubIcon from '../components/GithubIcon';
import { 
  Rocket, 
  PlusCircle, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  FileText
} from 'lucide-react';

import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import TechStackBadge from '../components/TechStackBadge';
import PDFViewer from '../components/PDFViewer';
import ProjectGallery from '../components/ProjectGallery';
import ConfirmationModal from '../components/ConfirmationModal';
import EmptyState from '../components/EmptyState';

const MySubmission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMySubmissions = async () => {
    try {
      const response = await submissionService.getMySubmission();
      if (response.success) {
        setSubmissions(response.submissions || []);
      }
    } catch (err) {
      toast.error('Failed to load your project submission');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const handleSubmitFinal = async (id) => {
    setActionLoading(true);
    try {
      await submissionService.submitProject(id);
      toast.success('Project finalized and submitted successfully!');
      fetchMySubmissions();
    } catch (err) {
      toast.error(err.message || 'Failed to submit project');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await submissionService.deleteSubmission(deleteModal.id);
      toast.success('Submission draft deleted');
      setDeleteModal({ isOpen: false, id: null, title: '' });
      fetchMySubmissions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete submission');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading project submission..." />;
  }

  if (submissions.length === 0) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <EmptyState
          icon={Rocket}
          title="No Project Submission Found"
          description="Your team has not created a submission draft for any hackathon yet."
          actionLabel="Create Submission Wizard"
          onAction={() => navigate('/participant/create-submission')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Team Project Submission</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Project Submission</h1>
        </div>

        <Link
          to="/participant/create-submission"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Submission</span>
        </Link>
      </div>

      {/* Submission List */}
      <div className="space-y-8">
        {submissions.map((sub) => {
          const isDraft = sub.status === 'Draft';
          return (
            <div key={sub._id} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>

              {/* Top Banner Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      sub.projectLogo ||
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={sub.projectName}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
                  />
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                      {sub.hackathon?.title}
                    </span>
                    <h2 className="text-2xl font-black text-white">{sub.projectName}</h2>
                    <p className="text-xs text-slate-400">Team: {sub.team?.teamName}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                  <StatusBadge status={sub.status} />
                  <span className="text-xs text-slate-400">
                    Updated {new Date(sub.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Quick Action Links Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  {sub.githubRepository && (
                    <a
                      href={sub.githubRepository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <GithubIcon className="w-4 h-4 text-indigo-400" />
                      <span>GitHub Repository</span>
                    </a>
                  )}


                  {sub.liveDemoURL && (
                    <a
                      href={sub.liveDemoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                {isDraft && (
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/participant/submission/edit/${sub._id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Draft</span>
                    </Link>

                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: sub._id, title: sub.projectName })}
                      className="p-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleSubmitFinal(sub._id)}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Final</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              {sub.techStack && sub.techStack.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Technology Stack:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sub.techStack.map((tech, idx) => (
                      <TechStackBadge key={idx} name={tech} />
                    ))}
                  </div>
                </div>
              )}

              {/* Problem & Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">
                    Problem Statement
                  </span>
                  <p className="text-slate-200 leading-relaxed">{sub.problemStatement}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">
                    Proposed Solution
                  </span>
                  <p className="text-slate-200 leading-relaxed">{sub.solution}</p>
                </div>
              </div>

              {/* Presentation PDF */}
              {sub.presentationPDF && <PDFViewer pdfUrl={sub.presentationPDF} />}

              {/* Screenshot Gallery */}
              {sub.screenshots && sub.screenshots.length > 0 && (
                <ProjectGallery screenshots={sub.screenshots} />
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Submission Draft"
        message={`Are you sure you want to delete the submission draft for "${deleteModal.title}"?`}
        confirmText="Delete Draft"
        confirmColor="bg-red-600 hover:bg-red-500"
        loading={actionLoading}
      />
    </div>
  );
};

export default MySubmission;
