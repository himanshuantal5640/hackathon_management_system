import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  Award, 
  Clock, 
  ArrowLeft, 
  User, 
  Share2, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await hackathonService.getHackathonById(id);
        if (response.success) {
          setHackathon(response.hackathon);
        }
      } catch (err) {
        toast.error('Failed to load hackathon details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id, navigate]);

  // Live Countdown Timer logic
  useEffect(() => {
    if (!hackathon?.registrationDeadline) return;

    const targetDate = new Date(hackathon.registrationDeadline).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hackathon]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading event details..." />;
  }

  if (!hackathon) return null;

  const {
    title,
    description,
    theme,
    mode,
    venue,
    bannerImage,
    startDate,
    endDate,
    registrationDeadline,
    prizePool,
    maxTeamSize,
    rules,
    judgingCriteria,
    status,
    createdBy,
  } = hackathon;

  const formattedPrize = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(prizePool || 0);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
        <div className="h-64 sm:h-80 w-full relative bg-slate-900">
          <img
            src={bannerImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <StatusBadge status={status} />
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-slate-700">
              {mode} Event
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block">
              {theme}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Live Countdown Timer & Prize Ribbon */}
        <div className="p-6 bg-slate-900/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Countdown Timer */}
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1 justify-center sm:justify-start">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Registration Closes In:
            </span>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-lg font-black text-white font-mono">{timeLeft.days}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Days</span>
              </div>
              <span className="text-slate-600 font-bold">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-lg font-black text-white font-mono">{timeLeft.hours}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Hrs</span>
              </div>
              <span className="text-slate-600 font-bold">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-lg font-black text-white font-mono">{timeLeft.minutes}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Min</span>
              </div>
              <span className="text-slate-600 font-bold">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-lg font-black text-indigo-400 font-mono">{timeLeft.seconds}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Sec</span>
              </div>
            </div>
          </div>

          {/* Grand Prize & Register Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-4 glass-card px-6 py-3 rounded-2xl border border-amber-500/30">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase block">Grand Prize Pool</span>
                <span className="text-2xl font-black text-white">{formattedPrize}</span>
              </div>
            </div>

            <Link
              to={`/participant/register/${id}`}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Register Now</span>
            </Link>
          </div>
        </div>
      </div>


      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Guidelines */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">About the Hackathon</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Rules */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Official Rules</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              {rules}
            </p>
          </div>

          {/* Judging Criteria */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Judging Criteria</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              {judgingCriteria}
            </p>
          </div>
        </div>

        {/* Right Col: Timeline & Organizer Details */}
        <div className="space-y-6">
          {/* Schedule & Key Info */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Event Timeline
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Reg. Deadline</span>
                  <span className="font-bold text-slate-200">
                    {new Date(registrationDeadline).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Starts On</span>
                  <span className="font-bold text-slate-200">
                    {new Date(startDate).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Calendar className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Ends On</span>
                  <span className="font-bold text-slate-200">
                    {new Date(endDate).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Venue / Location</span>
                  <span className="font-bold text-slate-200">{venue}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Users className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 uppercase font-semibold block">Team Constraints</span>
                  <span className="font-bold text-slate-200">Max {maxTeamSize} Members / Team</span>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer Card */}
          {createdBy && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hosted By
              </h3>

              <div className="flex items-center space-x-4">
                <img
                  src={createdBy.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={createdBy.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{createdBy.name}</h4>
                  <span className="text-xs text-indigo-400 uppercase font-semibold">
                    {createdBy.role}
                  </span>
                  <p className="text-xs text-slate-500 truncate">{createdBy.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;
