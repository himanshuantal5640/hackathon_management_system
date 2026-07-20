import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamService } from '../services/teamService';
import toast from 'react-hot-toast';
import { Key, UserPlus, ArrowLeft, Users, Crown, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const JoinTeam = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [teamPreview, setTeamPreview] = useState(null);
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  const handleSearchTeam = async (e) => {
    e.preventDefault();
    if (!inviteCode || inviteCode.trim().length === 0) {
      toast.error('Please enter an invite code');
      return;
    }

    setSearching(true);
    setTeamPreview(null);
    try {
      const response = await teamService.getTeamByInviteCode(inviteCode.trim());
      if (response.success) {
        setTeamPreview(response.team);
      }
    } catch (err) {
      toast.error(err.message || 'Invalid invite code or team is full.');
    } finally {
      setSearching(false);
    }
  };

  const handleJoinConfirm = async () => {
    if (!inviteCode) return;
    setJoining(true);
    try {
      const response = await teamService.joinTeam(inviteCode.trim());
      if (response.success) {
        toast.success(response.message || 'Joined team successfully!');
        navigate('/participant/my-team');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to join team');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="space-y-1 text-center">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 inline-block mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Join a Hackathon Team</h1>
          <p className="text-xs text-slate-400">
            Enter the 8-character invite code provided by your team leader.
          </p>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleSearchTeam} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Key className="w-5 h-5 text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="ENTER INVITE CODE (e.g. A1B2C3D4)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full pl-11 pr-28 py-3.5 rounded-xl glass-input text-base font-mono font-bold tracking-widest text-white uppercase focus:outline-none placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={searching || !inviteCode}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {searching ? <LoadingSpinner size="sm" label="" /> : 'Lookup'}
            </button>
          </div>
        </form>

        {/* Team Preview Card */}
        {teamPreview && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                  {teamPreview.hackathon?.title}
                </span>
                <h3 className="text-xl font-extrabold text-white">{teamPreview.teamName}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {teamPreview.maxMembers - teamPreview.members?.length} Slots Left
              </span>
            </div>

            {/* Leader */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={
                  teamPreview.leader?.profileImage ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={teamPreview.leader?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/50"
              />
              <div className="text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> Leader
                </span>
                <span className="font-bold text-white">{teamPreview.leader?.name}</span>
              </div>
            </div>

            {/* Members avatars */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Current Members ({teamPreview.members?.length}):</span>
              <div className="flex flex-wrap gap-2">
                {teamPreview.members?.map((m) => (
                  <span
                    key={m._id}
                    className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5"
                  >
                    <Users className="w-3 h-3 text-purple-400" />
                    {m.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Join Action Button */}
            <button
              onClick={handleJoinConfirm}
              disabled={joining}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {joining ? (
                <LoadingSpinner size="sm" label="" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Join Team "{teamPreview.teamName}"</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinTeam;
