import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, Key } from 'lucide-react';

const InviteCodeBox = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Invite code copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
          <Key className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Team Invite Code
          </span>
          <span className="text-lg font-black text-indigo-300 font-mono tracking-widest">
            {code}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy Code</span>
          </>
        )}
      </button>
    </div>
  );
};

export default InviteCodeBox;
