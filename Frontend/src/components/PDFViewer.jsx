import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

const PDFViewer = ({ pdfUrl, title = 'Presentation Deck' }) => {
  if (!pdfUrl) return null;

  return (
    <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <span className="text-[11px] text-slate-400">PDF Document</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open PDF</span>
        </a>
        <a
          href={pdfUrl}
          download
          className="p-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;
