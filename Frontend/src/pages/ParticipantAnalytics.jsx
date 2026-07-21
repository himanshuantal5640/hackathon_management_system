import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';
import { Trophy, Users, Rocket, Sparkles, Award } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsCard from '../components/AnalyticsCard';

const ParticipantAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const res = await analyticsService.getParticipantAnalytics();
        if (res.success) setAnalytics(res);
      } catch (err) {
        toast.error('Failed to load participant metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading participant metrics..." />;
  }

  if (!analytics) return null;

  const { stats } = analytics;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personal Developer Metrics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Participant Standing Analytics</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard title="Registered Hackathons" count={stats.registeredHackathons} icon={Trophy} color="indigo" />
        <AnalyticsCard title="Active Teams" count={stats.activeTeams} icon={Users} color="purple" />
        <AnalyticsCard title="Projects Submitted" count={stats.submissionsCount} icon={Rocket} color="emerald" />
        <AnalyticsCard
          title="Best Leaderboard Rank"
          count={stats.bestRank !== 'N/A' ? `#${stats.bestRank}` : 'N/A'}
          icon={Award}
          color="amber"
          sublabel={stats.positionLabel}
        />
      </div>
    </div>
  );
};

export default ParticipantAnalytics;
