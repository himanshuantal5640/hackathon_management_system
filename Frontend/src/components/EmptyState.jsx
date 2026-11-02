import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Hackathons Found',
  description = 'There are no hackathons matching your search criteria or role permissions.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-16 px-4 glass-panel rounded-3xl border border-slate-800 text-center space-y-4 flex flex-col items-center justify-center my-6">
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
        <Icon className="w-10 h-10" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
