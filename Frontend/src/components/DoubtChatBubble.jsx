import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../services/socket';
import { teamService } from '../services/teamService';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  X,
  Send,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const DoubtChatBubble = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('team'); // 'team' or 'organizer'
  const [teams, setTeams] = useState([]);
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  
  // Participant specific states
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [proposalQuery, setProposalQuery] = useState('');
  const [proposals, setProposals] = useState([]);
  
  // Active chat
  const [activeProposal, setActiveProposal] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  const messagesEndRef = useRef(null);

  // Load team data and proposals from localStorage
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchWorkspace = async () => {
      try {
        const teamRes = await teamService.getMyTeam();
        if (teamRes.success) {
          setTeams(teamRes.teams || []);
        }
        
        const hackRes = await hackathonService.getAllHackathons();
        if (hackRes.success) {
          setRegisteredHackathons(hackRes.hackathons || []);
          if (hackRes.hackathons.length > 0) {
            setSelectedHackathonId(hackRes.hackathons[0]._id);
          }
        }
      } catch (err) {
        console.warn('Failed to load details for bubble chat');
      }
    };

    fetchWorkspace();

    // Load Proposals
    const storedProposals = localStorage.getItem('doubt_chat_proposals');
    if (storedProposals) {
      setProposals(JSON.parse(storedProposals));
    }
  }, [isAuthenticated, user]);

  // Handle Judge direct chat initialization
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'judge') {
      const judgeProposal = {
        id: `judge-chat-${user._id}`,
        participantId: user._id,
        participantName: `${user.name} (Judge)`,
        hackathonId: 'direct',
        hackathonTitle: 'Organizer Help Desk',
        query: 'Direct chat with Judge',
        status: 'Approved',
        isJudge: true,
        createdAt: new Date().toISOString()
      };
      setActiveProposal(judgeProposal);
      
      // Load message history
      const storedMsgs = localStorage.getItem(`doubt_chat_msgs_${judgeProposal.id}`);
      setChatMessages(storedMsgs ? JSON.parse(storedMsgs) : []);
    }
  }, [isAuthenticated, user]);

  // Join socket room for active proposal
  useEffect(() => {
    if (activeProposal) {
      socket.emit('joinTeamRoom', activeProposal.id);
    }
  }, [activeProposal]);



  // Socket listener for real-time bubble chat messages & status approvals
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socket.on('receiveTeamMessage', (data) => {
      // Security check: participants must never receive judge-organizer direct messages
      if (user.role === 'participant' && data.teamId && data.teamId.startsWith('judge-chat-')) {
        return;
      }

      if (activeProposal && activeProposal.id === data.teamId) {
        setChatMessages(prev => {
          const exists = prev.some(m => m.timestamp === data.timestamp && m.senderId === data.senderId);
          if (exists) return prev;
          return [...prev, data];
        });
      }
    });

    socket.on('receiveDoubtMessage', (data) => {
      // Security check: participants must never receive judge-organizer direct messages
      if (user.role === 'participant' && data.proposalId && data.proposalId.startsWith('judge-chat-')) {
        return;
      }

      if (activeProposal && activeProposal.id === data.proposalId) {
        setChatMessages(prev => {
          const exists = prev.some(m => m.timestamp === data.timestamp && m.senderId === data.senderId);
          if (exists) return prev;
          return [...prev, data];
        });
      }
    });


    socket.on('receiveProposalUpdate', () => {
      const stored = localStorage.getItem('doubt_chat_proposals');
      if (stored) {
        setProposals(JSON.parse(stored));
      }
    });

    return () => {
      socket.off('receiveTeamMessage');
      socket.off('receiveDoubtMessage');
      socket.off('receiveProposalUpdate');
    };
  }, [isAuthenticated, user, activeProposal]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isAuthenticated || !user) return null;

  const isOrganizer = user.role === 'organizer' || user.role === 'admin';
  const isJudge = user.role === 'judge';

  // Filter proposals relevant to this user
  const userProposals = isOrganizer 
    ? proposals 
    : proposals.filter(p => p.participantId === user._id);

  // Submit Chat Proposal (Participant)
  const handleSubmitProposal = (e) => {
    e.preventDefault();
    if (!proposalQuery.trim()) return;

    const selectedHack = registeredHackathons.find(h => h._id === selectedHackathonId);
    
    const newProposal = {
      id: `prop-${Date.now()}`,
      participantId: user._id,
      participantName: user.name,
      hackathonId: selectedHackathonId,
      hackathonTitle: selectedHack?.title || 'Hackathon Event',
      query: proposalQuery.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newProposal, ...proposals];
    localStorage.setItem('doubt_chat_proposals', JSON.stringify(updated));
    setProposals(updated);
    setProposalQuery('');
    toast.success('Chat proposal submitted to organizer!');

    // Notify other clients via socket
    socket.emit('broadcastSystemNotification', {
      type: 'CHAT PROPOSAL',
      message: `New doubt chat proposal submitted by ${user.name} for ${selectedHack?.title || 'Event'}.`
    });
    socket.emit('receiveProposalUpdate');
  };

  // Approve / Reject Proposal (Organizer)
  const handleProposalAction = (id, newStatus) => {
    const updated = proposals.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    localStorage.setItem('doubt_chat_proposals', JSON.stringify(updated));
    setProposals(updated);
    toast.success(`Proposal marked as ${newStatus}`);
    
    // Notify clients
    socket.emit('receiveProposalUpdate');
  };

  // Open active chat feed
  const openChat = (proposal) => {
    setActiveProposal(proposal);
    // Load message history from localStorage
    const storedMsgs = localStorage.getItem(`doubt_chat_msgs_${proposal.id}`);
    setChatMessages(storedMsgs ? JSON.parse(storedMsgs) : []);
  };

  // Send message in doubt chat
  const handleSendDoubtMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      proposalId: activeProposal.id,
      senderId: user._id,
      senderName: user.name,
      text: messageInput.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    localStorage.setItem(`doubt_chat_msgs_${activeProposal.id}`, JSON.stringify(updated));
    
    // Emit through socket
    socket.emit('sendDoubtMessage', {
      proposalId: activeProposal.id,
      senderId: user._id,
      senderName: user.name,
      text: messageInput.trim(),
      timestamp: newMsg.timestamp
    });


    // If Judge, register the proposal automatically so organizers can reply
    if (user.role === 'judge') {
      const storedProposals = localStorage.getItem('doubt_chat_proposals');
      const parsed = storedProposals ? JSON.parse(storedProposals) : [];
      const exists = parsed.some(p => p.id === activeProposal.id);
      if (!exists) {
        const updatedProposals = [activeProposal, ...parsed];
        localStorage.setItem('doubt_chat_proposals', JSON.stringify(updatedProposals));
        socket.emit('receiveProposalUpdate');
      }
    }

    setMessageInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[500px] glass-panel rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-950 border-b border-slate-750 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {isJudge ? 'Organizer Help Desk' : 'Doubt Desk'}
                </h3>
                <p className="text-[10px] text-indigo-300">
                  {isJudge ? 'Direct Judge-Organizer Chat' : 'Live Doubt Solver Center'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => { setIsOpen(false); if (!isJudge) setActiveProposal(null); }}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Interface (If active proposal is selected) */}
          {activeProposal ? (
            <div className="flex-1 flex flex-col bg-slate-950/90">
              {/* Back to list */}
              <div className="p-2 border-b border-slate-900 flex items-center justify-between text-xs bg-slate-900/40">
                {!isJudge ? (
                  <button 
                    onClick={() => setActiveProposal(null)}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>Back to proposals</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-amber-400 font-bold">
                    Connected with Organizer
                  </span>
                )}
                <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {isJudge ? 'Judge Direct' : `Topic: ${activeProposal.query}`}
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl text-[11px] text-slate-400 text-center leading-relaxed">
                  📢 Direct live chat with the event organizer. Ask queries or clear evaluation doubts.
                </div>

                {chatMessages.map((msg, index) => {
                  const isMe = msg.senderId === user._id;
                  return (
                    <div key={index} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end ml-auto' : 'self-start items-start'}`}>
                      <span className="text-[9px] text-slate-500 mb-0.5">{msg.senderName}</span>
                      <div className={`p-2.5 rounded-2xl text-xs ${
                        isMe ? 'bg-indigo-650 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendDoubtMessage} className="p-3 border-t border-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Tabs selector */}
              {!isOrganizer && !isJudge && (
                <div className="grid grid-cols-2 text-center text-xs font-semibold border-b border-slate-800/80">
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`py-3 transition-colors ${activeTab === 'team' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    Team Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('organizer')}
                    className={`py-3 transition-colors ${activeTab === 'organizer' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    Organizer Queries
                  </button>
                </div>
              )}

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 1. Team Chat Quick Access */}
                {!isOrganizer && !isJudge && activeTab === 'team' && (
                  <div className="space-y-3">
                    {teams.length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-500 italic">
                        No team joined yet. Form a team to access chat.
                      </div>
                    ) : (
                      teams.map(t => (
                        <div key={t._id} className="p-4 glass-card border border-slate-800 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white">{t.teamName}</h4>
                            <span className="text-[10px] text-indigo-400 font-bold font-mono">Teammates</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-snug">
                            Collaborate with your {t.members?.length} team members and resolve conflicts.
                          </p>
                          <button
                            onClick={() => openChat({ id: t._id, query: 'Team Chat', hackathonTitle: t.hackathon?.title || 'Hackathon' })}
                            className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center justify-center space-x-1"
                          >
                            <span>Open Chat Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 2. Participant Organizer Query proposals */}
                {!isOrganizer && !isJudge && activeTab === 'organizer' && (
                  <div className="space-y-4">
                    {/* Proposal Submission Form */}
                    <form onSubmit={handleSubmitProposal} className="p-4 glass-card border border-slate-800 rounded-2xl space-y-3 bg-indigo-950/5">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Submit Chat Proposal</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-semibold uppercase">Choose Event</label>
                        <select
                          value={selectedHackathonId}
                          onChange={(e) => setSelectedHackathonId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none"
                        >
                          {registeredHackathons.map(h => (
                            <option key={h._id} value={h._id}>{h.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-semibold uppercase">Explain Query / Doubt</label>
                        <textarea
                          rows={2}
                          value={proposalQuery}
                          onChange={(e) => setProposalQuery(e.target.value)}
                          placeholder="e.g. Can we submit our code via zip instead of GitHub?"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs text-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md transition-all flex items-center justify-center space-x-1"
                      >
                        <span>Send Proposal Request</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Proposals Directory */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300">Your Proposals List</h4>
                      {userProposals.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic text-center">No proposals submitted yet.</p>
                      ) : (
                        userProposals.map(p => (
                          <div key={p.id} className="p-3 glass-card border border-slate-800/80 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white truncate max-w-[150px]">{p.hackathonTitle}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                                p.status === 'Approved' 
                                  ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20' 
                                  : p.status === 'Rejected' 
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                    : 'bg-amber-500/10 text-amber-450 border-amber-500/20'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{p.query}</p>
                            
                            {p.status === 'Approved' && (
                              <button
                                onClick={() => openChat(p)}
                                className="w-full py-1.5 rounded-lg text-[10px] font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-center space-x-1"
                              >
                                <span>Start Live Chat</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Organizer Review Panel */}
                {isOrganizer && (
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl text-center space-y-1">
                      <h4 className="text-xs font-bold text-purple-300 flex items-center justify-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-purple-400" />
                        <span>Doubt Chat Invitations</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Approve participant chat proposals to resolve doubts in real-time.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-350">Chat Requests & Proposals</h4>
                      {userProposals.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-8">No doubt proposals received.</p>
                      ) : (
                        userProposals.map(p => (
                          <div key={p.id} className="p-3 glass-card border border-slate-800 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white truncate">{p.participantName}</span>
                              <span className="text-[9px] text-indigo-400 font-bold font-mono uppercase">{p.hackathonTitle}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-850">
                              "{p.query}"
                            </p>

                            {p.status === 'Pending' ? (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleProposalAction(p.id, 'Approved')}
                                  className="py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleProposalAction(p.id, 'Rejected')}
                                  className="py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : p.status === 'Approved' ? (
                              <button
                                onClick={() => openChat(p)}
                                className="w-full py-1.5 rounded-lg text-[10px] font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-center space-x-1"
                              >
                                <span>Open Chat Feed</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <div className="text-center text-[10px] text-rose-400 font-bold bg-rose-500/5 py-1 rounded border border-rose-500/15">
                                Proposal Rejected
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 transition-transform active:scale-95 flex items-center justify-center hover:rotate-12 cursor-pointer border border-indigo-400/20"
        title="Doubt Help Desk"
      >
        {isOpen ? <X className="w-6 h-6 animate-in spin-in duration-200" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default DoubtChatBubble;
