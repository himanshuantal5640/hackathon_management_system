import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'Please confirm this action.',
  confirmText = 'Confirm',
  confirmColor = 'bg-indigo-600 hover:bg-indigo-500',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-indigo-400">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-white ${confirmColor} shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5`}
          >
            {loading ? <LoadingSpinner size="sm" label="" /> : <span>{confirmText}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
