import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { teamService } from '../services/teamService';
import toast from 'react-hot-toast';
import { 
  Trophy, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Users, 
  PlusCircle, 
  UserPlus, 
  Compass, 
  ArrowRight,
  Sparkles,
  FolderKanban
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import RegistrationCard from '../components/RegistrationCard';
import TeamCard from '../components/TeamCard';

const ParticipantDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipantData = async () => {
    try {
      const [regRes, teamRes] = await Promise.all([
        registrationService.getMyRegistrations(),
        teamService.getMyTeam(),
      ]);

      if (regRes.success) setRegistrations(regRes.registrations || []);
      if (teamRes.success) setTeams(teamRes.teams || []);
    } catch (err) {
      toast.error('Failed to load participant dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipantData();
  }, []);

  const totalRegistrations = registrations.filter((r) => r.status !== 'Cancelled').length;
  const pendingCount = registrations.filter((r) => r.status === 'Pending').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;
  const teamCount = teams.length;

  const handleCancelRegistration = async (id) => {
    try {
      await registrationService.cancelRegistration(id);
      toast.success('Registration cancelled');
      fetchParticipantData();
    } catch (err) {
      toast.error('Failed to cancel registration');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Participant Portal..." />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Participant Dashboard</h1>
          <p className="text-sm text-slate-400">
            Track your hackathon registrations, view approval statuses, and collaborate with team members.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/hackathons"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Register Event</span>
          </Link>

          <Link
            to="/participant/create-team"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Team</span>
          </Link>

          <Link
            to="/participant/join-team"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join Team</span>
          </Link>

          <Link
            to="/participant/my-submission"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-pink-300 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 transition-all flex items-center gap-1.5"
          >
            <FolderKanban className="w-4 h-4" />
            <span>My Submissions</span>
          </Link>
        </div>

      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Registered Events
            </span>
            <span className="text-2xl font-black text-white">{totalRegistrations}</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Pending Approvals
            </span>
            <span className="text-2xl font-black text-white">{pendingCount}</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Approved Entries
            </span>
            <span className="text-2xl font-black text-white">{approvedCount}</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Active Teams
            </span>
            <span className="text-2xl font-black text-white">{teamCount}</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Registrations & Active Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Registrations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>My Registrations</span>
            </h2>
            <Link
              to="/participant/my-registrations"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {registrations.length === 0 ? (
            <div className="py-12 glass-panel rounded-3xl border border-slate-800 text-center space-y-3">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">You haven't registered for any hackathons yet.</p>
              <Link
                to="/hackathons"
                className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
              >
                Browse Hackathons
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.slice(0, 4).map((r) => (
                <RegistrationCard
                  key={r._id}
                  registration={r}
                  onCancel={handleCancelRegistration}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Active Teams Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>My Team Workspace</span>
            </h2>
          </div>

          {teams.length === 0 ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-xs">You are not in any active teams yet.</p>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/participant/create-team"
                  className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all"
                >
                  Create Team
                </Link>
                <Link
                  to="/participant/join-team"
                  className="w-full py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
                >
                  Join via Code
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {teams.map((t) => (
                <TeamCard key={t._id} team={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
