import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';
import { Layers, Sparkles, ArrowRight, ExternalLink, FileText, CheckCircle2, Edit3 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import GithubIcon from '../components/GithubIcon';

const AssignedProjects = () => {
  const [assignments, setAssignments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, reviewRes] = await Promise.all([
          reviewService.getJudgeAssignments(),
          reviewService.getJudgeReviews(),
        ]);
        if (assignRes.success) setAssignments(assignRes.assignments || []);
        if (reviewRes.success) setReviews(reviewRes.reviews || []);
      } catch (err) {
        toast.error('Failed to load assigned projects or evaluation status');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Fetching assigned project submissions..." />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Judge Assignment Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Assigned Project Submissions</h1>
      </div>

      {/* Grid */}
      {assignments.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Projects Assigned"
          description="You do not have any projects assigned for evaluation yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((asgn) => {
            const sub = asgn.submission;
            if (!sub) return null;

            // Check if evaluation/review exists for this submission
            const existingReview = reviews.find(
              (r) => r.submission?._id === sub._id || r.submission === sub._id
            );

            return (
              <div key={asgn._id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                      {asgn.hackathon?.title}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(asgn.assignedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <img
                      src={
                        sub.projectLogo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={sub.projectName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30 flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {sub.projectName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Team: {sub.team?.teamName}</p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex items-center space-x-2 text-xs pt-1">
                    {sub.githubRepository && (
                      <a
                        href={sub.githubRepository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <GithubIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {sub.presentationPDF && (
                      <a
                        href={sub.presentationPDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-red-400 transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Pitch Deck</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60">
                  {existingReview ? (
                    existingReview.status === 'Completed' || existingReview.status === 'Locked' ? (
                      <div className="w-full py-3 rounded-xl text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 text-center flex items-center justify-center space-x-1.5 cursor-not-allowed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span>Evaluation Done</span>
                      </div>
                    ) : (
                      <Link
                        to={`/judge/review/${sub._id}`}
                        className="w-full py-3 rounded-xl text-xs font-bold text-slate-200 bg-amber-600 hover:bg-amber-500 shadow-md transition-all flex items-center justify-center space-x-1.5"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Update Evaluation (Draft)</span>
                      </Link>
                    )
                  ) : (
                    <Link
                      to={`/judge/review/${sub._id}`}
                      className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Start Evaluation</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedProjects;
