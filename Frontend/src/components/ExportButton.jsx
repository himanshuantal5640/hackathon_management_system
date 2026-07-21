import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { exportService } from '../services/exportService';

const ExportButton = ({ hackathonId, type = 'csv', label }) => {
  const isCsv = type === 'csv';
  const url = isCsv ? exportService.getCSVUrl(hackathonId) : exportService.getPDFUrl(hackathonId);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={isCsv}
      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
        isCsv
          ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
          : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
      }`}
    >
      {isCsv ? <Table className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
      <span>{label || (isCsv ? 'Export CSV' : 'Export PDF Report')}</span>
    </a>
  );
};

export default ExportButton;
