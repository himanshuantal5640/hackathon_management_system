import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
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
  ShieldAlert,
  Search,
  UserX,
  Trash2,
  Lock,
  Unlock,
  ShieldCheck,
  Edit,
  Globe,
  MapPin,
  Calendar
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'users', 'hackathons'
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  // Modals / Modifying states
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [hackathonToDelete, setHackathonToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, hackathonsRes] = await Promise.all([
        analyticsService.getAdminAnalytics(),
        adminService.getAllUsers(),
        adminService.getAllHackathons()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (hackathonsRes.success) setHackathons(hackathonsRes.hackathons || []);
    } catch (err) {
      toast.error('Failed to load system administrator records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handler to toggle Block Status
  const handleToggleBlock = async (userId, currentlyBlocked) => {
    try {
      setActionLoading(true);
      const res = await adminService.toggleUserBlock(userId);
      if (res.success) {
        toast.success(res.message);
        // Update local state
        setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !currentlyBlocked } : u));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user block status');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler to change user role
  const handleRoleChangeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newRole) return;
    try {
      setActionLoading(true);
      const res = await adminService.updateUserRole(selectedUser._id, newRole);
      if (res.success) {
        toast.success(res.message);
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, role: newRole } : u));
        setSelectedUser(null);
        setNewRole('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler to delete user
  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      const res = await adminService.deleteUser(userToDelete._id);
      if (res.success) {
        toast.success(res.message || 'User account deleted successfully');
        setUsers(users.filter(u => u._id !== userToDelete._id));
        setUserToDelete(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete user account');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler to delete hackathon
  const handleDeleteHackathonConfirm = async () => {
    if (!hackathonToDelete) return;
    try {
      setActionLoading(true);
      const res = await adminService.deleteHackathon(hackathonToDelete._id);
      if (res.success) {
        toast.success(res.message || 'Hackathon deleted successfully');
        setHackathons(hackathons.filter(h => h._id !== hackathonToDelete._id));
        setHackathonToDelete(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete hackathon');
    } finally {
      setActionLoading(false);
    }
  };


  if (loading) {
    return <LoadingSpinner fullScreen label="Loading secure Administrator Console..." />;
  }

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const renderUserCardByRole = (roleTitle, roleIcon, roleName) => {

    const roleUsers = filteredUsers.filter(u => u.role === roleName);
    const IconComponent = roleIcon;

    return (
      <div className="glass-panel rounded-3xl border border-slate-850 p-6 space-y-4 bg-slate-950/20 shadow-xl flex flex-col h-[500px]">
        <div className="flex items-center justify-between border-b border-slate-850 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">{roleTitle}</h3>
              <p className="text-[10px] text-slate-400">Total: {roleUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {roleUsers.length === 0 ? (
            <p className="text-center text-slate-600 italic text-[11px] py-12">
              No {roleName}s found.
            </p>
          ) : (
            roleUsers.map(u => (
              <div key={u._id} className="p-3 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col space-y-2 hover:bg-slate-900/70 transition-all animate-in fade-in duration-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={u.profileImage}
                      alt={u.name}
                      className="w-8 h-8 rounded-full border border-slate-900 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xs truncate max-w-[140px]">{u.name}</p>
                      <span className="text-slate-500 text-[9px] block truncate max-w-[140px]">{u.email}</span>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[9px] border ${
                    u.isBlocked 
                      ? 'bg-rose-500/10 text-rose-450 border-rose-500/15' 
                      : 'bg-emerald-500/10 text-emerald-450 border-emerald-500/15'
                  }`}>
                    {u.isBlocked ? (
                      <>
                        <Lock className="w-2.5 h-2.5 text-rose-450" />
                        <span>Suspended</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Active</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900/60 pt-2 text-[10px]">
                  <span className="text-slate-550">Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => { setSelectedUser(u); setNewRole(u.role); }}
                      className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all"
                      title="Change Role"
                      disabled={actionLoading}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                      className={`p-1 rounded transition-all ${
                        u.isBlocked
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                      }`}
                      title={u.isBlocked ? "Unblock Account" : "Block Account"}
                      disabled={actionLoading}
                    >
                      {u.isBlocked ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setUserToDelete(u)}
                      className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                      title="Delete User"
                      disabled={actionLoading}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const COLORS = ['#6366f1', '#a855f7', '#f59e0b', '#10b981', '#ef4444'];
  const { stats, growthTrend, hackathonStatusBreakdown } = analytics || {};

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-red-650/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Governance Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Administrator Hub</h1>
          <p className="text-sm text-slate-400">
            Control platform operations, manage users and roles, delete guidelines-violating hackathons, and inspect growth analytics.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'text-indigo-400 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>System Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-indigo-400 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('hackathons')}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'hackathons'
              ? 'text-indigo-400 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Hackathons Manager ({hackathons.length})</span>
        </button>
      </div>

      {/* Tab 1: System Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Metrics Card Grid */}
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
              sublabel={`${stats.totalReviews} Reviews`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <ChartCard
              title="Hackathon Lifecycle Breakdown"
              description="Hackathons classified across status stages"
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
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none placeholder-slate-500"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-xs text-slate-400 font-semibold uppercase">Filter Role:</label>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
                <option value="judge">Judge</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {/* Directory Categorized Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {renderUserCardByRole("Participant Directory", Users, "participant")}
            {renderUserCardByRole("Organizer Directory", Building2, "organizer")}
            {renderUserCardByRole("Judge Console Directory", Award, "judge")}
          </div>
        </div>
      )}

      {/* Tab 3: Hackathon Management */}
      {activeTab === 'hackathons' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 text-xs font-black uppercase">
                    <th className="py-4 px-6">Hackathon Details</th>
                    <th className="py-4 px-6">Venue Mode</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Prize Pool</th>
                    <th className="py-4 px-6">Deadline</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-950/40 text-xs">
                  {hackathons.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500 italic">
                        No hackathons have been registered on the platform.
                      </td>
                    </tr>
                  ) : (
                    hackathons.map(h => (
                      <tr key={h._id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={h.bannerImage}
                              alt={h.title}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-bold text-white text-sm">{h.title}</p>
                              <span className="text-[11px] text-slate-400">{h.theme}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-indigo-400 font-mono text-[10px]">
                            {h.mode}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            h.status === 'Registration Open'
                              ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
                              : h.status === 'Completed'
                                ? 'bg-indigo-500/10 text-indigo-450 border-indigo-500/20'
                                : 'bg-amber-500/10 text-amber-450 border-amber-500/20'
                          }`}>
                            {h.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-white">
                          ${h.prizePool?.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-slate-450">
                          {new Date(h.registrationDeadline).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setHackathonToDelete(h)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Force Delete Hackathon"
                            disabled={actionLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Role Modification Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-850 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>Modify User Role</span>
            </h3>
            
            <p className="text-xs text-slate-450 leading-relaxed">
              Select the new administrative or operational role for user <strong>{selectedUser.name}</strong> ({selectedUser.email}).
            </p>

            <form onSubmit={handleRoleChangeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-550 font-bold uppercase">Assign Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none"
                >
                  <option value="participant">Participant (Standard Member)</option>
                  <option value="organizer">Organizer (Event Host)</option>
                  <option value="judge">Judge (Rubrics Evaluator)</option>
                  <option value="admin">Administrator (Global Owner)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25"
                >
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom User Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-850 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <Trash2 className="w-6 h-6 text-red-405" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete User Profile</h3>
                <p className="text-[10px] text-slate-500">Permanently terminate platform access</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-350 leading-relaxed">
              Are you absolutely sure you want to permanently delete user account <strong>{userToDelete.name}</strong> ({userToDelete.email})? All profile data, settings, and registrations will be lost.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-450 hover:text-white bg-slate-900 border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirm}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-650 hover:bg-red-550 shadow-md shadow-red-500/25 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Hackathon Delete Confirmation Modal */}
      {hackathonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-850 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-405">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <Trophy className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Hackathon Event</h3>
                <p className="text-[10px] text-slate-500">Remove hackathon and registrations</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-355 leading-relaxed">
              Are you absolutely sure you want to delete the hackathon <strong>{hackathonToDelete.title}</strong>? All team creations, project submissions, scoring evaluations, and leaderboard standings will be permanently deleted.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setHackathonToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-450 hover:text-white bg-slate-900 border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteHackathonConfirm}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-650 hover:bg-red-550 shadow-md shadow-red-500/25 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete Hackathon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminDashboard;
