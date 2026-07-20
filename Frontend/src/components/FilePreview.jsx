import React from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';

const FilePreview = ({ file, onRemove }) => {
  if (!file) return null;

  const isString = typeof file === 'string';
  const name = isString ? file.split('/').pop() : file.name;
  const isPdf = name.toLowerCase().endsWith('.pdf');

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
      <div className="flex items-center space-x-3 truncate pr-2">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
        </div>
        <span className="font-semibold text-slate-200 truncate">{name}</span>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FilePreview;
