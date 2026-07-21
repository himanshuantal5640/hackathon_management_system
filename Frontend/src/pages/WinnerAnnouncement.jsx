import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { leaderboardService } from '../services/leaderboardService';
import toast from 'react-hot-toast';
import WinnerCard from '../components/WinnerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, Sparkles, ArrowLeft, Megaphone, Award } from 'lucide-react';

const WinnerAnnouncement = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinnerData = async () => {
      try {
        const res = await leaderboardService.getLeaderboard(hackathonId);
        if (res.success) {
          setHackathon(res.hackathon);
          setLeaderboard(res.leaderboard || []);
        }
      } catch (err) {
        toast.error('Winner announcement not published yet.');
        navigate('/hackathons');
      } finally {
        setLoading(false);
      }
    };

    fetchWinnerData();
  }, [hackathonId, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading winner announcement podium..." />;
  }

  if (!hackathon) return null;

  // Find 1st, 2nd, and 3rd place items from leaderboard or declared team fields
  const firstPlaceItem = leaderboard.find((item) => item.rank === 1);
  const secondPlaceItem = leaderboard.find((item) => item.rank === 2);
  const thirdPlaceItem = leaderboard.find((item) => item.rank === 3);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase shadow-lg shadow-amber-500/10">
          <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Official Winner Declaration</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
          {hackathon.title} Podium Winners
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed">
          Celebrating the top innovative solutions built during <strong>{hackathon.title}</strong>!
        </p>

        {hackathon.winnerAnnouncement && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-left space-y-2 relative overflow-hidden shadow-2xl">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Megaphone className="w-4 h-4 text-amber-400" />
              Organizer Official Announcement
            </span>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {hackathon.winnerAnnouncement}
            </p>
          </div>
        )}
      </div>

      {/* Podium Grid (1st, 2nd, 3rd) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-stretch">
        {/* 2nd Place */}
        <div className="md:mt-8">
          <WinnerCard
            place={2}
            team={secondPlaceItem?.team}
            submission={secondPlaceItem?.submission}
          />
        </div>

        {/* 1st Place (Featured Center) */}
        <div className="md:-mt-4">
          <WinnerCard
            place={1}
            team={firstPlaceItem?.team}
            submission={firstPlaceItem?.submission}
          />
        </div>

        {/* 3rd Place */}
        <div className="md:mt-12">
          <WinnerCard
            place={3}
            team={thirdPlaceItem?.team}
            submission={thirdPlaceItem?.submission}
          />
        </div>
      </div>

      {/* CTA to Full Leaderboard */}
      <div className="pt-6 text-center">
        <Link
          to={`/leaderboard/${hackathonId}`}
          className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/25 transition-all items-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>View Full Leaderboard Rankings</span>
        </Link>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;
