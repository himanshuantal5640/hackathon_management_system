import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { 
  Trophy, 
  PlusCircle, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Edit3, 
  Trash2, 
  ArrowRight,
  Sparkles,
  BarChart3,
  UserCheck
} from 'lucide-react';

import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';

const OrganizerDashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, id: null, title: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchHackathons = async () => {
    try {
      const response = await hackathonService.getMyHackathons();
      if (response.success) {
        setHackathons(response.hackathons || []);
      }
    } catch (err) {
      toast.error('Failed to load organizer dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const totalHackathons = hackathons.length;
  const upcomingCount = hackathons.filter((h) => h.status === 'Upcoming').length;
  const regOpenCount = hackathons.filter((h) => h.status === 'Registration Open').length;
  const completedCount = hackathons.filter((h) => h.status === 'Completed').length;

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await hackathonService.deleteHackathon(deleteModalState.id);
      toast.success('Hackathon deleted successfully');
      setHackathons((prev) => prev.filter((h) => h._id !== deleteModalState.id));
      setDeleteModalState({ isOpen: false, id: null, title: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to delete hackathon');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleRegistration = async (id, currentStatus) => {
    try {
      if (currentStatus === 'Registration Open') {
        await hackathonService.closeRegistration(id);
        toast.success('Registration closed');
      } else {
        await hackathonService.openRegistration(id);
        toast.success('Registration opened');
      }
      fetchHackathons();
    } catch (err) {
      toast.error('Failed to update registration status');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Organizer Dashboard..." />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer Operations Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Organizer Dashboard</h1>
          <p className="text-sm text-slate-400">
            Manage your created hackathons, track registration status, and create new competitions.
          </p>
        </div>

        <Link
          to="/organizer/create"
          className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Hackathon</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Hackathons */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Managed
            </span>
            <span className="text-2xl font-black text-white">{totalHackathons}</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Upcoming
            </span>
            <span className="text-2xl font-black text-white">{upcomingCount}</span>
          </div>
        </div>

        {/* Registration Open */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Registration Open
            </span>
            <span className="text-2xl font-black text-white">{regOpenCount}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-2xl font-black text-white">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Hackathons Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Recent Hackathons</span>
          </h2>
          <Link
            to="/organizer/my-hackathons"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({totalHackathons})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {hackathons.length === 0 ? (
          <div className="py-12 glass-panel rounded-3xl border border-slate-800 text-center space-y-4">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">You haven't created any hackathons yet.</p>
            <Link
              to="/organizer/create"
              className="inline-flex px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
            >
              Create Your First Hackathon
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Hackathon</th>
                    <th className="py-4 px-6">Mode</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Prize Pool</th>
                    <th className="py-4 px-6">Reg. Deadline</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {hackathons.slice(0, 5).map((h) => (
                    <tr key={h._id} className="hover:bg-slate-900/40 transition-colors">
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
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-indigo-300 font-semibold border border-slate-800">
                          {h.mode}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={h.status} isPublished={h.isPublished} />
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-200">
                        ${h.prizePool?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(h.registrationDeadline).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleRegistration(h._id, h.status)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Toggle Registration"
                          >
                            {h.status === 'Registration Open' ? (
                              <Lock className="w-4 h-4 text-rose-400" />
                            ) : (
                              <Unlock className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                          <Link
                            to={`/organizer/assign-judges/${h._id}`}
                            className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                            title="Assign Judges"
                          >
                            <UserCheck className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/organizer/edit/${h._id}`}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteModalState({ isOpen: true, id: h._id, title: h.title })
                            }
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title={deleteModalState.title}
        loading={isDeleting}
      />
    </div>
  );
};

export default OrganizerDashboard;
