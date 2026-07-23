import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { socket } from '../services/socket';
import toast from 'react-hot-toast';
import { 
  Trophy, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Compass,
  UserCheck,
  Users,
  Award,
  Layers,
  FileCheck,
  UserPlus,
  BarChart3,
  FileText,
  Sun,
  Moon,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Load and listen for in-app Socket.io notifications
  useEffect(() => {
    if (isAuthenticated && user) {
      const stored = localStorage.getItem(`notifications_${user._id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      }

      // Listen for system notification (event added, deleted, result published)
      socket.on('receiveSystemNotification', (data) => {
        const newNotif = {
          id: Math.random().toString(),
          type: data.type || 'SYSTEM',
          message: data.message,
          timestamp: new Date().toISOString(),
          read: false
        };
        toast(data.message, { icon: '📢', duration: 5000 });
        setNotifications(prev => {
          const updated = [newNotif, ...prev];
          localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updated));
          return updated;
        });
        setUnreadCount(prev => prev + 1);
      });

      // Listen for invitation notification
      socket.on('receiveInviteNotification', (data) => {
        const newNotif = {
          id: Math.random().toString(),
          type: 'INVITATION',
          message: `${data.senderName} has invited you to join their team "${data.teamName}"!`,
          link: data.inviteLink,
          timestamp: new Date().toISOString(),
          read: false
        };
        toast(`${data.senderName} shared a team invitation link!`, { icon: '📩', duration: 6000 });
        setNotifications(prev => {
          const updated = [newNotif, ...prev];
          localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updated));
          return updated;
        });
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      socket.off('receiveSystemNotification');
      socket.off('receiveInviteNotification');
    };
  }, [isAuthenticated, user]);

  const clearNotifications = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updated));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setUserDropdownOpen(false);
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path) => location.pathname === path;

  // Role helper checks
  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const isJudge = user?.role === 'judge';
  const isParticipant = user?.role === 'participant';

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'organizer':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'judge':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-wider uppercase">
                Hack<span className="text-indigo-400">Pulse</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <Link
              to="/hackathons"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/hackathons')
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore</span>
            </Link>

            <Link
              to="/leaderboard"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/leaderboard')
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard</span>
            </Link>

            {/* Participant Links */}
            {isAuthenticated && isParticipant && (
              <>
                <Link
                  to="/participant/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/participant/dashboard')
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Participant Hub</span>
                </Link>

                <Link
                  to="/participant/my-team"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/participant/my-team')
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>My Team</span>
                </Link>

                <Link
                  to="/participant/my-submission"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/participant/my-submission')
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5 text-pink-400" />
                  <span>My Submissions</span>
                </Link>
              </>
            )}

            {/* Judge Links */}
            {isAuthenticated && isJudge && (
              <>
                <Link
                  to="/judge/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/judge/dashboard')
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Judge Portal</span>
                </Link>
              </>
            )}

            {/* Organizer Links */}
            {isAuthenticated && isOrganizer && (
              <>
                <Link
                  to="/organizer/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/organizer/dashboard')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                  <span>Organizer Hub</span>
                </Link>
              </>
            )}

            {/* Admin Links */}
            {isAuthenticated && isAdmin && (
              <>
                <Link
                  to="/admin/analytics"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/admin/analytics')
                      ? 'bg-red-600/20 text-red-300 border border-red-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-red-405" />
                  <span>Console</span>
                </Link>
              </>
            )}

            {/* Reports Link */}
            {isAuthenticated && (
              <Link
                to="/reports"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/reports')
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reports</span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar: Theme Toggle & User Profile */}
          <div className="flex items-center space-x-3">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-card text-amber-400 hover:text-amber-300 border border-slate-700 transition-all flex items-center justify-center cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Real-time Notifications Bell Dropdown */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl glass-card text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center justify-center relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2.5 w-80 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Platform Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-slate-500 italic">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-slate-900/40 transition-all space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">{n.type}</span>
                              <span className="text-[8px] text-slate-500">{new Date(n.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                            {n.link && (
                              <a
                                href={n.link}
                                className="text-[10px] text-amber-300 font-bold hover:underline inline-block mt-0.5"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Join Team Link ➔
                              </a>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated && isOrganizer && (
              <Link
                to="/organizer/create"
                className="hidden md:flex px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all items-center gap-1 animate-pulse"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Event</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 pr-3 rounded-full glass-card hover:bg-slate-800 transition-all border border-slate-700/60 cursor-pointer"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div className="text-left leading-tight hidden sm:block">
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                      {user.name}
                    </div>
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase rounded-md border ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/analytics"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-red-400" />
                        <span>System Analytics</span>
                      </Link>
                    )}

                    {isJudge && (
                      <Link
                        to="/judge/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                      >
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Judge Portal</span>
                      </Link>
                    )}

                    {isOrganizer && (
                      <Link
                        to="/organizer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span>Organizer Suite</span>
                      </Link>
                    )}

                    {isParticipant && (
                      <Link
                        to="/participant/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        <span>Participant Hub</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-400" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-650 hover:bg-indigo-600 transition-all shadow-md shadow-indigo-500/10"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl glass-card text-slate-300 hover:text-white border border-slate-700 md:hidden transition-all flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-850 bg-slate-950 p-4 space-y-3">
          <Link
            to="/hackathons"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Explore Hackathons
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-amber-400 hover:bg-slate-800"
          >
            Leaderboard
          </Link>

          {isAuthenticated ? (
            <>
              {isParticipant && (
                <>
                  <Link
                    to="/participant/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-medium text-indigo-400 hover:bg-slate-800"
                  >
                    Participant Hub
                  </Link>
                  <Link
                    to="/participant/my-team"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-medium text-purple-400 hover:bg-slate-800"
                  >
                    My Team
                  </Link>
                  <Link
                    to="/participant/my-submission"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-medium text-pink-400 hover:bg-slate-800"
                  >
                    My Submissions
                  </Link>
                </>
              )}

              {isJudge && (
                <Link
                  to="/judge/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-medium text-amber-400 hover:bg-slate-800"
                >
                  Judge Portal
                </Link>
              )}

              {isOrganizer && (
                <Link
                  to="/organizer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-medium text-purple-400 hover:bg-slate-800"
                >
                  Organizer Suite
                </Link>
              )}

              <Link
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Reports
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Profile Dashboard
              </Link>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-white bg-indigo-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
