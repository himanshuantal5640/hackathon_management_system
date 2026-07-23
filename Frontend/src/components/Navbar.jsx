import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
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
  Moon
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setUserDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'organizer':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'judge':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    }
  };

  const isActive = (path) => location.pathname === path;

  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';
  const isParticipant = user?.role === 'participant' || user?.role === 'admin';
  const isJudge = user?.role === 'judge' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Hack<span className="gradient-text">Pulse</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated && (

              <>
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
              </>
            )}

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
                  <span>Console</span>
                </Link>

                <Link
                  to="/organizer/analytics"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/organizer/analytics')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Analytics</span>
                </Link>
              </>
            )}

            {/* Reports Link */}
            {isAuthenticated && (
              <Link
                to="/reports"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/reports')
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
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
              className="p-2 rounded-xl glass-card text-amber-400 hover:text-amber-300 border border-slate-700 transition-all flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {isAuthenticated && isOrganizer && (
              <Link
                to="/organizer/create"
                className="hidden md:flex px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Event</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 pr-3 rounded-full glass-card hover:bg-slate-800 transition-all border border-slate-700/60"
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
                        <FolderKanban className="w-4 h-4 text-purple-400" />
                        <span>Organizer Console</span>
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
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {isAuthenticated && (

            <>
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
            </>
          )}

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
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 border border-slate-700 bg-slate-900/50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
