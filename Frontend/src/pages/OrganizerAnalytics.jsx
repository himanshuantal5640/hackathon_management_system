import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { leaderboardService } from '../services/leaderboardService';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { 
  Building2, 
  UserCheck, 
  Users, 
  Rocket, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Trophy,
  Globe
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsCard from '../components/AnalyticsCard';
import ChartCard from '../components/ChartCard';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const OrganizerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [myHackathons, setMyHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anRes, hRes] = await Promise.all([
          analyticsService.getOrganizerAnalytics(),
          hackathonService.getMyHackathons(),
        ]);

        if (anRes.success) setAnalytics(anRes);
        if (hRes.success && hRes.hackathons.length > 0) {
          setMyHackathons(hRes.hackathons);
          setSelectedHackathonId(hRes.hackathons[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load organizer analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateLeaderboard = async () => {
    if (!selectedHackathonId) return;
    setGenerateLoading(true);
    try {
      const res = await leaderboardService.generateLeaderboard(selectedHackathonId);
      if (res.success) {
        toast.success(res.message || 'Leaderboard generated with tie detection!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate leaderboard');
    } finally {
      setGenerateLoading(false);
    }
  };

  const handlePublishResults = async () => {
    if (!selectedHackathonId) return;
    setActionLoading(true);
    try {
      const res = await leaderboardService.publishResults(selectedHackathonId);
      if (res.success) {
        toast.success('Results published to public showcase!');
        setPublishModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to publish results');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading organizer event analytics..." />;
  }

  if (!analytics) return null;

  const { stats, registrationsPerHackathon } = analytics;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Organizer Analytics</h1>
          <p className="text-sm text-slate-400">
            Track participant registrations, approved teams, project submissions, and publish results.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {myHackathons.length > 0 && (
            <select
              value={selectedHackathonId}
              onChange={(e) => setSelectedHackathonId(e.target.value)}
              className="px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-white bg-slate-900 border border-slate-700 focus:outline-none"
            >
              {myHackathons.map((h) => (
                <option key={h._id} value={h._id} className="bg-slate-900 text-white">
                  {h.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleGenerateLeaderboard}
            disabled={generateLoading || !selectedHackathonId}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trophy className="w-4 h-4" />
            <span>{generateLoading ? 'Generating...' : 'Calculate Ranks'}</span>
          </button>

          <button
            onClick={() => setPublishModalOpen(true)}
            disabled={!selectedHackathonId}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            <span>Publish Results</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <AnalyticsCard title="My Hackathons" count={stats.myHackathons} icon={Building2} color="purple" />
        <AnalyticsCard title="Registrations" count={stats.registrations} icon={UserCheck} color="indigo" />
        <AnalyticsCard title="Approved Teams" count={stats.approvedTeams} icon={Users} color="emerald" />
        <AnalyticsCard title="Submissions" count={stats.submissions} icon={Rocket} color="amber" />
        <AnalyticsCard title="Completed Reviews" count={stats.completedReviews} icon={CheckCircle2} color="rose" />
        <AnalyticsCard title="Avg Score" count={`${stats.averageScore} / 70`} icon={Award} color="purple" />
      </div>

      {/* Recharts Bar Chart */}
      <ChartCard title="Registrations per Hackathon" description="Comparison of registrations across your events">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={registrationsPerHackathon}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="title" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Bar dataKey="registrations" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Publish Modal */}
      <ConfirmationModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handlePublishResults}
        title="Publish Official Results"
        message="Are you sure you want to publish the results and leaderboard for this hackathon? Participants will be notified via email."
        confirmText="Publish Results Now"
        confirmColor="bg-emerald-600 hover:bg-emerald-500"
        loading={actionLoading}
      />
    </div>
  );
};

export default OrganizerAnalytics;
