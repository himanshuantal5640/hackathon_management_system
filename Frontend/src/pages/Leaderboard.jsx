import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { leaderboardService } from '../services/leaderboardService';
import toast from 'react-hot-toast';
import { Trophy, Sparkles, Search, Compass, Award } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import LeaderboardTable from '../components/LeaderboardTable';
import SearchBar from '../components/SearchBar';
import ExportButton from '../components/ExportButton';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

const Leaderboard = () => {
  const { hackathonId } = useParams();
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathonId || '');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load published hackathons for dropdown
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await hackathonService.getAllHackathons();
        if (res.success && res.hackathons.length > 0) {
          setHackathons(res.hackathons);
          if (!selectedHackathonId) {
            setSelectedHackathonId(res.hackathons[0]._id);
          }
        }
      } catch (err) {
        toast.error('Failed to load hackathons');
      }
    };

    fetchHackathons();
  }, []);

  // Fetch Leaderboard when selected hackathon or filters change
  const fetchLeaderboard = async () => {
    if (!selectedHackathonId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await leaderboardService.getLeaderboard(selectedHackathonId, {
        search: searchQuery,
        page: currentPage,
        limit: 15,
      });

      if (res.success) {
        setLeaderboardData(res.leaderboard || []);
        setHackathon(res.hackathon);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      toast.error(err.message || 'Results for this hackathon are not published yet.');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedHackathonId, searchQuery, currentPage]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Rankings</span>
          </div>
          <h1 className="text-3xl font-black text-white">Hackathon Leaderboard</h1>
          <p className="text-sm text-slate-400">
            Real-time ranked standings based on judge evaluations across 7 criteria (Max 70 Points).
          </p>
        </div>

        {/* Hackathon Selector & Winner Link */}
        <div className="flex flex-wrap items-center gap-3">
          {hackathons.length > 0 && (
            <div className="glass-card px-4 py-2 rounded-2xl border border-slate-800 flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-semibold">Event:</span>
              <select
                value={selectedHackathonId}
                onChange={(e) => {
                  setSelectedHackathonId(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
              >
                {hackathons.map((h) => (
                  <option key={h._id} value={h._id} className="bg-slate-900 text-white">
                    {h.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link
            to={`/results/${selectedHackathonId}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 fill-white" />
            <span>Winner Showcase</span>
          </Link>
        </div>
      </div>

      {/* Controls Bar: Search & Exports */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by team, project, or leader..."
          />
        </div>

        {selectedHackathonId && (
          <div className="flex items-center space-x-3">
            <ExportButton hackathonId={selectedHackathonId} type="csv" label="Export CSV" />
            <ExportButton hackathonId={selectedHackathonId} type="pdf" label="Print / PDF Report" />
          </div>
        )}
      </div>

      {/* Main Leaderboard Table */}
      {loading ? (
        <LoadingSpinner label="Fetching leaderboard rankings..." />
      ) : leaderboardData.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Published Leaderboard Available"
          description="The organizer has not published the leaderboard for this hackathon yet."
        />
      ) : (
        <div className="space-y-4">
          <LeaderboardTable leaderboard={leaderboardData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
