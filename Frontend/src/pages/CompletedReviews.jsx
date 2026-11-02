import React, { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';
import { FileCheck, Sparkles, Award, Eye } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const CompletedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getJudgeReviews();
        if (response.success) {
          setReviews(response.reviews || []);
        }
      } catch (err) {
        toast.error('Failed to load your completed reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Fetching completed reviews..." />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Completed Evaluations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">My Submitted Reviews</h1>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No Completed Reviews Found"
          description="You haven't completed any project evaluations yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const sub = rev.submission;
            return (
              <div key={rev._id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={rev.status} />
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(rev.submittedAt || rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        sub?.projectLogo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={sub?.projectName}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {sub?.projectName || 'Project'}
                      </h3>
                      <p className="text-xs text-slate-400">Team: {sub?.team?.teamName}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold uppercase">Total Score:</span>
                    <span className="text-base font-black text-indigo-300 font-mono">
                      {rev.totalScore} / 70
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60">
                  <Link
                    to={`/judge/review-details/${rev._id}`}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Breakdown</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompletedReviews;
