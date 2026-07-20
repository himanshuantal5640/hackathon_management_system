import React from 'react';
import { Award } from 'lucide-react';

const ScoreCard = ({ title, score, max = 10 }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
      <div className="space-y-0.5">
        <span className="text-xs text-slate-400 font-semibold block">{title}</span>
        <div className="flex items-center space-x-1">
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-sm font-black text-white">{score}</span>
          <span className="text-[10px] text-slate-500 font-bold">/ {max}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
