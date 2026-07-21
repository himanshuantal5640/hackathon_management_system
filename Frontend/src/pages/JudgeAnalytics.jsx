import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';
import { Award, Layers, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsCard from '../components/AnalyticsCard';
import ChartCard from '../components/ChartCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const JudgeAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJudgeData = async () => {
      try {
        const res = await analyticsService.getJudgeAnalytics();
        if (res.success) setAnalytics(res);
      } catch (err) {
        toast.error('Failed to load judge analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchJudgeData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading judge performance metrics..." />;
  }

  if (!analytics) return null;

  const { stats, radarMetrics } = analytics;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evaluation Metrics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Judge Performance Analytics</h1>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard title="Assigned Projects" count={stats.assignedProjects} icon={Layers} color="indigo" />
        <AnalyticsCard title="Pending Reviews" count={stats.pendingReviews} icon={Clock} color="amber" />
        <AnalyticsCard title="Completed Reviews" count={stats.completedReviews} icon={CheckCircle2} color="emerald" />
        <AnalyticsCard title="Avg Score Given" count={`${stats.averageScoreGiven} / 70`} icon={Award} color="purple" />
      </div>

      {/* Recharts Criteria Averages Bar Chart */}
      <ChartCard title="Average Score per Evaluation Criteria" description="7-Criteria scoring distribution across projects">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={radarMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="criteria" stroke="#94a3b8" />
            <YAxis domain={[0, 10]} stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Bar dataKey="score" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default JudgeAnalytics;
