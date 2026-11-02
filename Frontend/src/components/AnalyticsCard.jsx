import React from 'react';

const AnalyticsCard = ({ title, count, icon: Icon, color = 'indigo', sublabel }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  const selectedColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
      <div className={`p-4 rounded-2xl border ${selectedColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-2xl font-black text-white">{count}</span>
        {sublabel && <span className="text-[11px] text-slate-400 block mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
};

export default AnalyticsCard;
