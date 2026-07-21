import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const RankBadge = ({ rank }) => {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-300">
        <Trophy className="w-3.5 h-3.5 fill-slate-950" />
        <span>1ST PLACE</span>
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 text-slate-950 shadow border border-slate-200">
        <Medal className="w-3.5 h-3.5 fill-slate-950" />
        <span>2ND PLACE</span>
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white shadow border border-amber-500/40">
        <Medal className="w-3.5 h-3.5 fill-white" />
        <span>3RD PLACE</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-slate-300 border border-slate-800">
      <span>#{rank}</span>
    </span>
  );
};

export default RankBadge;
