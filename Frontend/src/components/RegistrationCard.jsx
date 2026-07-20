import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Trophy, Calendar, Users, XCircle, ArrowRight } from 'lucide-react';

const RegistrationCard = ({ registration, onCancel }) => {
  const { _id, hackathon, team, status, registeredAt, remarks } = registration;

  if (!hackathon) return null;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {new Date(registeredAt).toLocaleDateString()}
          </span>
        </div>

        {/* Hackathon Info */}
        <div className="space-y-1">
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block">
            {hackathon.theme}
          </span>
          <h3 className="text-lg font-bold text-white leading-snug">{hackathon.title}</h3>
        </div>

        {/* Team status */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-purple-400" />
            Assigned Team:
          </span>
          {team ? (
            <span className="font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
              {team.teamName}
            </span>
          ) : (
            <span className="text-slate-500 font-medium italic">No Team Assigned</span>
          )}
        </div>

        {/* Remarks if rejected */}
        {status === 'Rejected' && remarks && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            <strong>Organizer Note:</strong> {remarks}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
        <Link
          to={`/hackathons/${hackathon._id}`}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          <span>Event Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {status !== 'Cancelled' && (
          <button
            onClick={() => onCancel(_id, hackathon.title)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel Registration</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationCard;
