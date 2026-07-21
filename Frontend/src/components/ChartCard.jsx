import React from 'react';

const ChartCard = ({ title, description, children }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
      <div className="h-64 sm:h-72 w-full pt-2">{children}</div>
    </div>
  );
};

export default ChartCard;
