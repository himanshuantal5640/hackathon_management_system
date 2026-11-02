import React from 'react';

const ScoreInput = ({ label, value, onChange, description, max = 10 }) => {
  const numVal = Number(value || 0);

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 5) return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-bold text-white block">{label}</label>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
        <div className={`px-3 py-1 rounded-xl text-sm font-black border ${getScoreColor(numVal)}`}>
          {numVal} / {max}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="range"
          min="0"
          max={max}
          step="1"
          value={numVal}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <input
          type="number"
          min="0"
          max={max}
          value={numVal}
          onChange={(e) => onChange(Math.min(max, Math.max(0, Number(e.target.value))))}
          className="w-16 px-2 py-1 rounded-lg glass-input text-center text-xs font-bold text-white focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ScoreInput;
