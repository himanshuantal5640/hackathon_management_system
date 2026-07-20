import React from 'react';
import StatusBadge from './StatusBadge';
import { Lock, Eye, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const EvaluationTable = ({ reviews, onLock, loadingId }) => {
  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Project & Team</th>
              <th className="py-4 px-6">Assigned Judge</th>
              <th className="py-4 px-6">Total Score</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Lock / View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reviews.map((rev) => (
              <tr key={rev._id} className="hover:bg-slate-900/40 transition-colors">
                {/* Project & Team */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        rev.submission?.projectLogo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={rev.submission?.projectName}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">
                        {rev.submission?.projectName || 'Project'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Team: {rev.submission?.team?.teamName || 'Team'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Assigned Judge */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={
                        rev.judge?.profileImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={rev.judge?.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/40"
                    />
                    <div>
                      <span className="font-bold text-slate-200 block">{rev.judge?.name}</span>
                      <span className="text-[10px] text-slate-500">{rev.judge?.email}</span>
                    </div>
                  </div>
                </td>

                {/* Score */}
                <td className="py-4 px-6">
                  <span className="font-black text-indigo-300 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 inline-flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {rev.totalScore} / 70
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <StatusBadge status={rev.status} />
                </td>

                {/* Lock Action & View */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/organizer/review-details/${rev._id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {rev.status !== 'Locked' ? (
                      <button
                        onClick={() => onLock(rev._id)}
                        disabled={loadingId === rev._id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Review</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 text-slate-500 border border-slate-800 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" /> Locked
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationTable;
