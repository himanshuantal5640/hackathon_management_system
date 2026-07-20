import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
          <Compass className="w-12 h-12 animate-spin-slow" />
        </div>
        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md text-xs font-black bg-red-500/20 border border-red-500/30 text-red-400">
          404 ERROR
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
        Page Lost In Space
      </h1>

      <p className="text-slate-400 max-w-md mb-8 text-base leading-relaxed">
        The requested URL or resource could not be found on HackPulse. Check the web address or return to the main dashboard.
      </p>

      <Link
        to="/"
        className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
