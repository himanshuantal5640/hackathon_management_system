import React, { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../services/socket';
import toast from 'react-hot-toast';
import { 
  Users, 
  Crown, 
  LogOut, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  MessageSquare, 
  Send,
  FolderKanban
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import InviteCodeBox from '../components/InviteCodeBox';
import MemberCard from '../components/MemberCard';
import ConfirmationModal from '../components/ConfirmationModal';
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

  // Chat panel state
  const [chatMessages, setChatMessages] = useState({});
  const [chatInputs, setChatInputs] = useState({});

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

  // Setup Socket connection & room joining for real-time team chat
  useEffect(() => {
    if (teams.length > 0) {
      const messages = {};
      const inputs = {};
      
      teams.forEach(t => {
        // Load stored message history
        const stored = localStorage.getItem(`team_chat_${t._id}`);
        messages[t._id] = stored ? JSON.parse(stored) : [
          {
            senderName: 'System Bot',
            senderId: 'system',
            text: `Welcome to team ${t.teamName}! Send this direct link to your friends so they can click and join your team automatically: ${window.location.origin}/participant/join-team/${t.inviteCode}`
          }
        ];
        // pre-populate input with invite link
        inputs[t._id] = `Hey! Join our hackathon team using this link: ${window.location.origin}/participant/join-team/${t.inviteCode}`;
        
        // Join live socket room for this team
        socket.emit('joinTeamRoom', t._id);
      });

      setChatMessages(messages);
      setChatInputs(inputs);
    }

    // Listen for live incoming messages via socket
    socket.on('receiveTeamMessage', (data) => {
      setChatMessages((prev) => {
        const teamMsgs = prev[data.teamId] || [];
        // Check for duplicates
        const alreadyExists = teamMsgs.some(
          (m) => m.senderId === data.senderId && m.text === data.text
        );
        if (alreadyExists) return prev;

        const updated = [
          ...teamMsgs,
          {
            senderName: data.senderName,
            senderId: data.senderId,
            text: data.text,
          },
        ];
        localStorage.setItem(`team_chat_${data.teamId}`, JSON.stringify(updated));
        return {
          ...prev,
          [data.teamId]: updated,
        };
      });
    });

    return () => {
      socket.off('receiveTeamMessage');
    };
  }, [teams]);

  const handleSendMessage = (e, teamId) => {
    e.preventDefault();
    const text = chatInputs[teamId];
    if (!text || text.trim().length === 0) return;

    const msgPayload = {
      teamId,
      senderName: user?.name || 'Participant',
      senderId: user?._id || 'user',
      text: text.trim()
    };

    // Emit live message through socket
    socket.emit('sendTeamMessage', msgPayload);

    // If it's an invite link share, broadcast invite notification system-wide
    if (text.includes('/join-team/')) {
      const activeTeam = teams.find((t) => t._id === teamId);
      socket.emit('sendInviteNotification', {
        senderName: user?.name || 'Participant',
        teamName: activeTeam?.teamName || 'Hackathon Team',
        inviteLink: text.trim().match(/https?:\/\/\S+/)?.[0] || ''
      });
    }

    // Clear input
    setChatInputs({ ...chatInputs, [teamId]: '' });
  };

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
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl w-full">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 inline-block">
            <Users className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">No Active Team Found</h2>
            <p className="text-sm text-slate-400">
              You are currently not part of any active hackathon team. Get started by creating your own team or joining one with an invite code or invite link.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/participant/create-team')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Create a Team</span>
            </button>
            <button
              onClick={() => navigate('/participant/join-team')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-850 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Join a Team</span>
            </button>
          </div>
        </div>
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
                  onClick={() => navigate('/participant/my-submission')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all flex items-center gap-1.5"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Submit Project</span>
                </button>

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

            {/* Invite Code & Direct Link Component */}
            <div className="max-w-3xl">
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

            {/* Team Chat & Link Sharer Panel */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Live Team Chat & invite link share (Socket.io)</span>
                </h3>
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                  Active Live Connection
                </span>
              </div>

              {/* Chat Feed */}
              <div className="h-44 overflow-y-auto p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3 flex flex-col">
                {chatMessages[team._id]?.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center my-auto italic">
                    No messages yet. Send a join link to invite your team members!
                  </p>
                ) : (
                  chatMessages[team._id]?.map((msg, index) => {
                    const isSystem = msg.senderId === 'system';
                    const isCurrentUser = msg.senderId === user?._id;
                    return (
                      <div key={index} className={`flex flex-col max-w-[85%] ${isSystem ? 'mx-auto text-center' : isCurrentUser ? 'self-end items-end' : 'self-start items-start'}`}>
                        {!isSystem && <span className="text-[10px] text-slate-500 mb-0.5">{msg.senderName}</span>}
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isSystem 
                            ? 'bg-slate-900/50 text-slate-400 border border-slate-800 text-center rounded-xl font-mono' 
                            : isCurrentUser 
                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                              : 'bg-slate-800 text-slate-200 rounded-tl-none'
                        }`}>
                          {msg.text.includes('/join-team/') ? (
                            <span>
                              {msg.text.split(' ').map((word, wIdx) => {
                                if (word.startsWith('http://') || word.startsWith('https://')) {
                                  return (
                                    <a key={wIdx} href={word} className="underline text-amber-300 font-bold hover:text-amber-200 break-all inline-block">
                                      {word}
                                    </a>
                                  );
                                }
                                return word + ' ';
                              })}
                            </span>
                          ) : (
                            msg.text
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={(e) => handleSendMessage(e, team._id)} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type message or paste invite link..."
                  value={chatInputs[team._id] || ''}
                  onChange={(e) => setChatInputs({ ...chatInputs, [team._id]: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl glass-input text-xs text-white focus:outline-none placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-650 hover:bg-indigo-600 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
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
