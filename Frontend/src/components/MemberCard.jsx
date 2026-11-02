import React from 'react';
import { Crown, UserX, ArrowRightLeft } from 'lucide-react';

const MemberCard = ({
  member,
  isLeader = false,
  currentUserIsLeader = false,
  onRemove,
  onTransferLeadership,
}) => {
  return (
    <div className="glass-card p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={
              member.profileImage ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
          />
          {isLeader && (
            <span
              className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow"
              title="Team Leader"
            >
              <Crown className="w-3 h-3 fill-slate-950" />
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-white">{member.name}</h4>
            {isLeader ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                LEADER
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                MEMBER
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{member.email}</p>
        </div>
      </div>

      {/* Leader Actions for non-leader members */}
      {currentUserIsLeader && !isLeader && (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onTransferLeadership(member._id, member.name)}
            className="p-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
            title="Make Team Leader"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onRemove(member._id, member.name)}
            className="p-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            title="Remove Member"
          >
            <UserX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberCard;
