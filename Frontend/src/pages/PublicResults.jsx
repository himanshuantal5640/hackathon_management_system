import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { leaderboardService } from '../services/leaderboardService';
import toast from 'react-hot-toast';
import WinnerCard from '../components/WinnerCard';
import LeaderboardTable from '../components/LeaderboardTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ExportButton from '../components/ExportButton';
import { Trophy, ArrowLeft, Award, Sparkles, MapPin, Calendar, Users } from 'lucide-react';

const PublicResults = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await leaderboardService.getLeaderboard(hackathonId);
        if (res.success) {
          setHackathon(res.hackathon);
          setLeaderboard(res.leaderboard || []);
        }
      } catch (err) {
        toast.error('Public results for this event have not been published yet.');
        navigate('/hackathons');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [hackathonId, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading public results..." />;
  }

  if (!hackathon) return null;

  const firstPlace = leaderboard.find((item) => item.rank === 1);
  const secondPlace = leaderboard.find((item) => item.rank === 2);
  const thirdPlace = leaderboard.find((item) => item.rank === 3);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Hero Event Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl space-y-6">
        <div className="h-64 sm:h-80 w-full relative bg-slate-900">
          <img
            src={hackathon.bannerImage}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              RESULTS PUBLISHED
            </span>
            <ExportButton hackathonId={hackathonId} type="csv" label="Download CSV" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block">
              {hackathon.theme}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">{hackathon.title}</h1>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="p-6 bg-slate-900/80 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
          <div>
            <span className="text-slate-500 uppercase font-semibold block">Prize Pool</span>
            <span className="text-lg font-black text-amber-400">
              ${hackathon.prizePool?.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-semibold block">Total Projects</span>
            <span className="text-lg font-black text-white">{leaderboard.length}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-semibold block">Event Mode</span>
            <span className="text-lg font-black text-indigo-300">{hackathon.mode}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-semibold block">Published On</span>
            <span className="text-sm font-bold text-slate-300">
              {hackathon.publishedAt ? new Date(hackathon.publishedAt).toLocaleDateString() : 'Today'}
            </span>
          </div>
        </div>
      </div>

      {/* Winner Podium Showcase */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-amber-400">
          <Trophy className="w-6 h-6 fill-amber-400" />
          <h2 className="text-2xl font-black text-white">Winners Showcase</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <WinnerCard place={2} team={secondPlace?.team} submission={secondPlace?.submission} />
          <WinnerCard place={1} team={firstPlace?.team} submission={firstPlace?.submission} />
          <WinnerCard place={3} team={thirdPlace?.team} submission={thirdPlace?.submission} />
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>Complete Leaderboard Rankings</span>
          </h2>
          <ExportButton hackathonId={hackathonId} type="pdf" label="Print PDF Report" />
        </div>

        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
};

export default PublicResults;
