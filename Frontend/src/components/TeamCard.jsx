import React from 'react';
import { Link } from 'react-router-dom';
import InviteCodeBox from './InviteCodeBox';
import { Users, Crown, Trophy, ArrowRight } from 'lucide-react';

const TeamCard = ({ team }) => {
  const { _id, teamName, leader, members, hackathon, inviteCode, maxMembers, status } = team;

  const memberCount = members?.length || 0;
  const availableSlots = maxMembers - memberCount;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            {status} Team
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {memberCount} / {maxMembers} Members
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
            {hackathon?.title || 'Hackathon Event'}
          </span>
          <h3 className="text-xl font-extrabold text-white">{teamName}</h3>
        </div>

        {/* Leader Info */}
        {leader && (
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <img
              src={
                leader.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={leader.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/50"
            />
            <div className="text-xs">
              <span className="text-slate-500 block uppercase text-[10px] font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> Team Leader
              </span>
              <span className="font-bold text-slate-200">{leader.name}</span>
            </div>
          </div>
        )}

        {/* Invite Code Box */}
        {inviteCode && <InviteCodeBox code={inviteCode} />}

        {/* Available slots indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Available Member Slots:</span>
          <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {availableSlots > 0 ? `${availableSlots} Slots Open` : 'Team Full'}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/60">
        <Link
          to={`/participant/my-team`}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-1.5"
        >
          <span>Manage Team Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
