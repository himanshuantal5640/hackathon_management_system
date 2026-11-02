import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
      <span>
        Page <strong className="text-white">{currentPage}</strong> of{' '}
        <strong className="text-white">{totalPages}</strong>
      </span>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-xl glass-card text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-xl glass-card text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
