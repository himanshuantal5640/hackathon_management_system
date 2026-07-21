import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';
import { 
  Users, 
  Trophy, 
  UserCheck, 
  Rocket, 
  Award, 
  Sparkles, 
  Building2, 
  CheckCircle2 
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsCard from '../components/AnalyticsCard';
import ChartCard from '../components/ChartCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        if (res.success) {
          setAnalytics(res);
        }
      } catch (err) {
        toast.error('Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading system-wide admin analytics..." />;
  }

  if (!analytics) return null;

  const { stats, growthTrend, hackathonStatusBreakdown } = analytics;

  const COLORS = ['#6366f1', '#a855f7', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">System Admin Analytics</h1>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnalyticsCard
          title="Total Users"
          count={stats.totalUsers}
          icon={Users}
          color="indigo"
          sublabel={`${stats.totalParticipants} Participants`}
        />
        <AnalyticsCard
          title="Organizers"
          count={stats.totalOrganizers}
          icon={Building2}
          color="purple"
        />
        <AnalyticsCard
          title="Judges Pool"
          count={stats.totalJudges}
          icon={Award}
          color="amber"
        />
        <AnalyticsCard
          title="Hackathons"
          count={stats.totalHackathons}
          icon={Trophy}
          color="emerald"
          sublabel={`${stats.completedHackathons} Completed`}
        />
        <AnalyticsCard
          title="Submissions"
          count={stats.totalSubmissions}
          icon={Rocket}
          color="rose"
          sublabel={`${stats.totalReviews} Reviews Done`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Growth Line Chart */}
        <ChartCard
          title="Platform Registration Growth"
          description="Monthly participant registration trend"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="_id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Line type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Hackathon Status Pie Chart */}
        <ChartCard
          title="Hackathon Status Breakdown"
          description="Distribution of hackathons across lifecycle stages"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hackathonStatusBreakdown}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {hackathonStatusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminAnalytics;
