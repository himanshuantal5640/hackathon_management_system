import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Eye, EyeOff, Maximize2, X } from 'lucide-react';
import { getFileUrl } from '../utils/fileUrl';

const PDFViewer = ({ pdfUrl, title = 'Presentation Deck' }) => {
  const [showInline, setShowInline] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!pdfUrl) return null;

  const resolvedUrl = getFileUrl(pdfUrl);
  const filename = pdfUrl.split('/').pop() || 'presentation.pdf';

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(resolvedUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(resolvedUrl, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      {/* PDF Header Card */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold text-white truncate">{title}</h4>
            <span className="text-[11px] text-slate-400 font-mono truncate block">
              {filename}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Toggle Inline Preview */}
          <button
            type="button"
            onClick={() => setShowInline((prev) => !prev)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-colors flex items-center gap-1.5"
          >
            {showInline ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showInline ? 'Hide Preview' : 'Preview'}</span>
          </button>

          {/* Open in New Tab */}
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open PDF</span>
          </a>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Embed Preview */}
      {showInline && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-3 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Inline Document Viewer</span>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>
          <div className="w-full h-[550px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            <iframe
              src={resolvedUrl}
              title={title}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Fullscreen Modal View */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[90vh] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white">{title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 w-full bg-slate-950">
              <iframe
                src={resolvedUrl}
                title={title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
