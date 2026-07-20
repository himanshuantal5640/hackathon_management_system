import React, { useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon } from 'lucide-react';

const UploadBox = ({
  label,
  accept,
  multiple = false,
  onChange,
  hint = 'Max file size 5MB',
  icon: Icon = UploadCloud,
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(multiple ? Array.from(e.target.files) : e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      <div
        onClick={handleClick}
        className="p-6 rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-indigo-500/50 transition-all cursor-pointer text-center space-y-2 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-200">
            Click to upload {label || 'files'}
          </p>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;
