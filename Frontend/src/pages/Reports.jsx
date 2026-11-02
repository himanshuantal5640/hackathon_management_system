import React, { useState, useEffect } from 'react';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { FileText, Table, Sparkles, Download, Trophy } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ExportButton from '../components/ExportButton';

const Reports = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await hackathonService.getAllHackathons();
        if (res.success && res.hackathons.length > 0) {
          setHackathons(res.hackathons);
          setSelectedHackathonId(res.hackathons[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load hackathons');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading report center..." />;
  }

  const selectedHackathon = hackathons.find((h) => h._id === selectedHackathonId);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Export Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Platform Reports & Exports</h1>
      </div>

      {/* Main Container */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Hackathon Event to Generate Reports:
          </label>
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="w-full sm:w-96 px-4 py-3 rounded-xl glass-input text-sm text-white bg-slate-900 focus:outline-none"
          >
            {hackathons.map((h) => (
              <option key={h._id} value={h._id} className="bg-slate-900 text-white">
                {h.title}
              </option>
            ))}
          </select>
        </div>

        {selectedHackathon && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* CSV Export Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-block">
                  <Table className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Leaderboard CSV Data Sheet</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export complete rankings, scores, team leaders, emails, and judge evaluation counts in standard CSV format for Excel/Google Sheets analysis.
                </p>
              </div>

              <div className="pt-2">
                <ExportButton hackathonId={selectedHackathonId} type="csv" label="Download Leaderboard CSV" />
              </div>
            </div>

            {/* PDF Report Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 inline-block">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Printable PDF Report</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate an official printable PDF report containing winner standings, detailed score averages, and hackathon specifications.
                </p>
              </div>

              <div className="pt-2">
                <ExportButton hackathonId={selectedHackathonId} type="pdf" label="Open / Print PDF Report" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
