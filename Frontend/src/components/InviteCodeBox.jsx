import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, Key, Link2 } from 'lucide-react';

const InviteCodeBox = ({ code }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success('Invite code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    if (!code) return;
    const directLink = `${window.location.origin}/participant/join-team/${code}`;
    navigator.clipboard.writeText(directLink);
    setCopiedLink(true);
    toast.success('Direct team join link copied!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 flex-shrink-0">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Team Invite Code
          </span>
          <span className="text-lg font-black text-indigo-300 font-mono tracking-widest block sm:inline">
            {code}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 border border-slate-700"
        >
          {copiedCode ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied Code!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied Link!</span>
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5" />
              <span>Copy Join Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InviteCodeBox;
