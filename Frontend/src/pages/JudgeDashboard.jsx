import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  FileCheck, 
  Layers,
  Trophy,
  ExternalLink,
  Edit3
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const JudgeDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, reviewRes, hackRes] = await Promise.all([
          reviewService.getJudgeAssignments(),
          reviewService.getJudgeReviews(),
          hackathonService.getAllHackathons(),
        ]);

        if (assignRes.success) setAssignments(assignRes.assignments || []);
        if (reviewRes.success) setReviews(reviewRes.reviews || []);
        if (hackRes.success) setHackathons(hackRes.hackathons || []);
      } catch (err) {
        toast.error('Failed to load judge dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Judge Portal..." />;
  }

  const assignedCount = assignments.length;
  const completedReviewsList = reviews.filter((r) => r.status === 'Completed' || r.status === 'Locked');
  const completedCount = completedReviewsList.length;
  const pendingCount = Math.max(0, assignedCount - completedCount);

  // Calculate Average score given
  const avgScore =
    completedCount > 0
      ? (
          completedReviewsList.reduce((acc, r) => acc + (r.totalScore || 0), 0) /
          completedCount
        ).toFixed(1)
      : '0.0';

  // Group assignments into two lists
  const awaitingEvaluations = [];
  const completedEvaluations = [];

  assignments.forEach((asgn) => {
    const sub = asgn.submission;
    if (!sub) return;

    const existingReview = reviews.find(
      (r) => r.submission?._id === sub._id || r.submission === sub._id
    );
    const isCompleted = existingReview && (existingReview.status === 'Completed' || existingReview.status === 'Locked');

    if (isCompleted) {
      completedEvaluations.push({ asgn, sub, existingReview });
    } else {
      awaitingEvaluations.push({ asgn, sub, existingReview });
    }
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge Evaluation Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Judge Dashboard</h1>
          <p className="text-sm text-slate-400">
            Evaluate assigned project submissions across 7 criteria and grade technical innovation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/judge/assigned-projects"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Evaluate Projects</span>
          </Link>

          <Link
            to="/judge/completed-reviews"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>Completed Reviews</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Assigned Projects
            </span>
            <span className="text-2xl font-black text-white">{assignedCount}</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Pending Reviews
            </span>
            <span className="text-2xl font-black text-white">{pendingCount}</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Completed Reviews
            </span>
            <span className="text-2xl font-black text-white">{completedCount}</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Avg Score Awarded
            </span>
            <span className="text-2xl font-black text-white">{avgScore} / 70</span>
          </div>
        </div>
      </div>

      {/* Section 1: Assigned Projects Awaiting Evaluation */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>Assigned Projects Awaiting Evaluation ({awaitingEvaluations.length})</span>
          </h2>
          <Link
            to="/judge/assigned-projects"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Assigned</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {awaitingEvaluations.length === 0 ? (
          <div className="py-12 glass-panel rounded-3xl border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-slate-350 text-sm font-bold">All Assigned Evaluations Completed!</p>
            <p className="text-slate-500 text-xs">No pending project evaluations left to score.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awaitingEvaluations.slice(0, 6).map(({ asgn, sub, existingReview }) => (
              <div key={asgn._id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                    {asgn.hackathon?.title}
                  </span>
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        sub?.projectLogo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={sub?.projectName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {sub?.projectName || 'Project'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Team: {sub?.team?.teamName}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  {existingReview ? (
                    <Link
                      to={`/judge/review/${sub?._id}`}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-amber-600 hover:bg-amber-500 shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Update Evaluation (Draft)</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/judge/review/${sub?._id}`}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <span>Evaluate Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Completed Evaluations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-450" />
            <span>Completed Evaluations ({completedEvaluations.length})</span>
          </h2>
          <Link
            to="/judge/completed-reviews"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-350 flex items-center gap-1"
          >
            <span>View All Completed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {completedEvaluations.length === 0 ? (
          <div className="py-12 glass-panel rounded-3xl border border-slate-800 text-center space-y-2">
            <Award className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">No completed evaluations found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedEvaluations.slice(0, 6).map(({ asgn, sub, existingReview }) => (
              <div key={asgn._id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between bg-emerald-950/5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                      {asgn.hackathon?.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                      Score: {existingReview.totalScore} / 70
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        sub?.projectLogo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={sub?.projectName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {sub?.projectName || 'Project'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Team: {sub?.team?.teamName}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <div className="w-full py-2.5 rounded-xl text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 text-center flex items-center justify-center space-x-1.5 cursor-not-allowed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Evaluation Done</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explore Hackathons Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-450" />
            <span>Hackathon Events Directory</span>
          </h2>
        </div>

        {hackathons.length === 0 ? (
          <div className="py-12 glass-panel rounded-3xl border border-slate-800 text-center space-y-3">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">No hackathons registered in the platform yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((h) => (
              <div key={h._id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="relative h-32 rounded-2xl overflow-hidden">
                    <img src={h.bannerImage} alt={h.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded bg-indigo-650 text-white text-[10px] font-bold uppercase">
                        {h.mode}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{h.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{h.theme}</p>
                  </div>
                </div>

                <Link
                  to={`/hackathons/${h._id}`}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-850 text-center transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>View Event Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeDashboard;
