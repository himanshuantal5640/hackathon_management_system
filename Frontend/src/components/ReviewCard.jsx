import React from 'react';
import StatusBadge from './StatusBadge';
import ScoreCard from './ScoreCard';
import { Award, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const {
    judge,
    totalScore,
    innovation,
    technicalComplexity,
    userInterface,
    functionality,
    scalability,
    documentation,
    presentation,
    comments,
    strengths,
    improvements,
    status,
    submittedAt,
  } = review;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <img
            src={
              judge?.profileImage ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={judge?.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
          />
          <div>
            <h4 className="text-sm font-bold text-white">{judge?.name || 'Judge'}</h4>
            <span className="text-xs text-slate-400">
              Evaluated {submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Draft'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              Total Score
            </span>
            <span className="text-lg font-black text-indigo-300 font-mono">{totalScore} / 70</span>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Score Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ScoreCard title="Innovation" score={innovation} />
        <ScoreCard title="Tech Complexity" score={technicalComplexity} />
        <ScoreCard title="UI / UX" score={userInterface} />
        <ScoreCard title="Functionality" score={functionality} />
        <ScoreCard title="Scalability" score={scalability} />
        <ScoreCard title="Documentation" score={documentation} />
        <ScoreCard title="Presentation" score={presentation} />
      </div>

      {/* Feedback Comments */}
      <div className="space-y-3 pt-2 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="font-bold text-indigo-400 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> Comments & Feedback
          </span>
          <p className="text-slate-300 leading-relaxed">{comments}</p>
        </div>

        {strengths && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" /> Key Strengths
            </span>
            <p className="text-slate-200 leading-relaxed">{strengths}</p>
          </div>
        )}

        {improvements && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Areas for Improvement
            </span>
            <p className="text-slate-200 leading-relaxed">{improvements}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
