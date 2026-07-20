import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { teamService } from '../services/teamService';
import toast from 'react-hot-toast';
import { Users, Sparkles, Crown, Key } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const OrganizerTeams = () => {
  const { hackathonId } = useParams();
  const [myHackathons, setMyHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathonId || '');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await hackathonService.getMyHackathons();
        if (res.success && res.hackathons.length > 0) {
          setMyHackathons(res.hackathons);
          if (!selectedHackathonId) {
            setSelectedHackathonId(res.hackathons[0]._id);
          }
        }
      } catch (err) {
        toast.error('Failed to load organizer events');
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedHackathonId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await teamService.getHackathonTeams(selectedHackathonId);
        if (res.success) {
          setTeams(res.teams || []);
        }
      } catch (err) {
        toast.error('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedHackathonId]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer Team Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Registered Event Teams</h1>
        </div>

        {/* Hackathon Selector */}
        {myHackathons.length > 0 && (
          <div className="glass-card px-4 py-2 rounded-2xl border border-slate-800 flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Select Event:</span>
            <select
              value={selectedHackathonId}
              onChange={(e) => setSelectedHackathonId(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
            >
              {myHackathons.map((h) => (
                <option key={h._id} value={h._id} className="bg-slate-900 text-white">
                  {h.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Teams Grid */}
      {loading ? (
        <LoadingSpinner label="Fetching teams..." />
      ) : teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Registered Teams Found"
          description="No participant teams have been created for this event yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => (
            <div key={t._id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">{t.teamName}</h3>
                  <span className="text-xs text-slate-400">
                    {t.members?.length} / {t.maxMembers} Members
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                  CODE: {t.inviteCode}
                </span>
              </div>

              {/* Leader */}
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <img
                  src={
                    t.leader?.profileImage ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={t.leader?.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/50"
                />
                <div className="text-xs">
                  <span className="text-slate-500 text-[10px] font-semibold flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> Leader
                  </span>
                  <span className="font-bold text-white">{t.leader?.name}</span>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Members:</span>
                <div className="space-y-1.5">
                  {t.members?.map((m) => (
                    <div
                      key={m._id}
                      className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-200">{m.name}</span>
                      <span className="text-[10px] text-slate-500">{m.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerTeams;
