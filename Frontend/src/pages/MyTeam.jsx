import React, { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Users, Crown, LogOut, Trash2, Edit3, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import InviteCodeBox from '../components/InviteCodeBox';
import MemberCard from '../components/MemberCard';
import ConfirmationModal from '../components/ConfirmationModal';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const MyTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [confirmLeave, setConfirmLeave] = useState({ isOpen: false, teamId: null });
  const [confirmDisband, setConfirmDisband] = useState({ isOpen: false, teamId: null, name: '' });
  const [confirmRemove, setConfirmRemove] = useState({ isOpen: false, teamId: null, memberId: null, name: '' });
  const [confirmTransfer, setConfirmTransfer] = useState({ isOpen: false, teamId: null, newLeaderId: null, name: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyTeams = async () => {
    try {
      const response = await teamService.getMyTeam();
      if (response.success) {
        setTeams(response.teams || []);
      }
    } catch (err) {
      toast.error('Failed to load your team workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const handleLeaveTeam = async () => {
    setActionLoading(true);
    try {
      await teamService.leaveTeam(confirmLeave.teamId);
      toast.success('Left team successfully');
      setConfirmLeave({ isOpen: false, teamId: null });
      fetchMyTeams();
    } catch (err) {
      toast.error(err.message || 'Failed to leave team');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisbandTeam = async () => {
    setActionLoading(true);
    try {
      await teamService.deleteTeam(confirmDisband.teamId);
      toast.success('Team disbanded successfully');
      setConfirmDisband({ isOpen: false, teamId: null, name: '' });
      fetchMyTeams();
    } catch (err) {
      toast.error(err.message || 'Failed to disband team');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    setActionLoading(true);
    try {
      await teamService.removeMember(confirmRemove.teamId, confirmRemove.memberId);
      toast.success(`Removed ${confirmRemove.name} from team`);
      setConfirmRemove({ isOpen: false, teamId: null, memberId: null, name: '' });
      fetchMyTeams();
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransferLeadership = async () => {
    setActionLoading(true);
    try {
      await teamService.transferLeadership(confirmTransfer.teamId, confirmTransfer.newLeaderId);
      toast.success(`Leadership transferred to ${confirmTransfer.name}`);
      setConfirmTransfer({ isOpen: false, teamId: null, newLeaderId: null, name: '' });
      fetchMyTeams();
    } catch (err) {
      toast.error(err.message || 'Failed to transfer leadership');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading team workspace..." />;
  }

  if (teams.length === 0) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <EmptyState
          icon={Users}
          title="No Active Team Found"
          description="You are currently not part of any active hackathon team."
          actionLabel="Create a Team"
          onAction={() => navigate('/participant/create-team')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {teams.map((team) => {
        const isLeader = team.leader?._id === user?._id || user?.role === 'admin';
        return (
          <div key={team._id} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-3xl rounded-full pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{team.hackathon?.title || 'Hackathon Event'}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white">{team.teamName}</h1>
              </div>

              {/* Team Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setConfirmLeave({ isOpen: true, teamId: team._id })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Leave Team</span>
                </button>

                {isLeader && (
                  <button
                    onClick={() => setConfirmDisband({ isOpen: true, teamId: team._id, name: team.teamName })}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disband Team</span>
                  </button>
                )}
              </div>
            </div>

            {/* Invite Code Component */}
            <div className="max-w-xl">
              <InviteCodeBox code={team.inviteCode} />
            </div>

            {/* Members Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Team Members ({team.members?.length} / {team.maxMembers})</span>
                </h3>
                <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  {team.maxMembers - team.members?.length} Slots Remaining
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.members?.map((m) => (
                  <MemberCard
                    key={m._id}
                    member={m}
                    isLeader={m._id === team.leader?._id}
                    currentUserIsLeader={isLeader}
                    onRemove={(memberId, name) =>
                      setConfirmRemove({ isOpen: true, teamId: team._id, memberId, name })
                    }
                    onTransferLeadership={(newLeaderId, name) =>
                      setConfirmTransfer({ isOpen: true, teamId: team._id, newLeaderId, name })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmLeave.isOpen}
        onClose={() => setConfirmLeave({ isOpen: false, teamId: null })}
        onConfirm={handleLeaveTeam}
        title="Leave Team"
        message="Are you sure you want to leave this team? Note: If you are the leader, you must transfer leadership first."
        confirmText="Confirm Leave"
        confirmColor="bg-rose-600 hover:bg-rose-500"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={confirmDisband.isOpen}
        onClose={() => setConfirmDisband({ isOpen: false, teamId: null, name: '' })}
        onConfirm={handleDisbandTeam}
        title="Disband Team"
        message={`Are you sure you want to permanently disband team "${confirmDisband.name}"? All members will be unlinked.`}
        confirmText="Disband Team"
        confirmColor="bg-red-600 hover:bg-red-500"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={confirmRemove.isOpen}
        onClose={() => setConfirmRemove({ isOpen: false, teamId: null, memberId: null, name: '' })}
        onConfirm={handleRemoveMember}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${confirmRemove.name} from the team?`}
        confirmText="Remove Member"
        confirmColor="bg-rose-600 hover:bg-rose-500"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={confirmTransfer.isOpen}
        onClose={() => setConfirmTransfer({ isOpen: false, teamId: null, newLeaderId: null, name: '' })}
        onConfirm={handleTransferLeadership}
        title="Transfer Leadership"
        message={`Transfer team leadership to ${confirmTransfer.name}? You will relinquish leader control.`}
        confirmText="Transfer Leadership"
        confirmColor="bg-amber-600 hover:bg-amber-500"
        loading={actionLoading}
      />
    </div>
  );
};

export default MyTeam;
