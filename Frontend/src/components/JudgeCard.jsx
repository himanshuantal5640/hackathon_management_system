import React from 'react';
import { UserCheck, CheckCircle2 } from 'lucide-react';

const JudgeCard = ({ judge, isSelected = false, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
          : 'glass-card border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <img
          src={
            judge.profileImage ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          }
          alt={judge.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
        />
        <div>
          <h4 className="text-sm font-bold text-white">{judge.name}</h4>
          <p className="text-xs text-slate-400">{judge.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
          {judge.role}
        </span>
        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
      </div>
    </div>
  );
};

export default JudgeCard;
