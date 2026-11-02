import React from 'react';
import { Code2 } from 'lucide-react';

const TechStackBadge = ({ name }) => {
  return (
    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-indigo-300 border border-slate-800">
      <Code2 className="w-3 h-3 text-indigo-400" />
      <span>{name}</span>
    </span>
  );
};

export default TechStackBadge;
