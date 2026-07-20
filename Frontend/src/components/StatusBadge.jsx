import React from 'react';

const StatusBadge = ({ status, isPublished }) => {
  const getStatusStyle = (statusName) => {
    switch (statusName) {
      case 'Registration Open':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Registration Closed':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Ongoing':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Completed':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Upcoming':
      default:
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusStyle(
          status
        )}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
        {status}
      </span>

      {isPublished !== undefined && (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
            isPublished
              ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isPublished ? 'Published' : 'Draft'}
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
