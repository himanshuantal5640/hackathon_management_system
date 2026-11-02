import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Lock, 
  Unlock,
  UserCheck
} from 'lucide-react';


const HackathonCard = ({
  hackathon,
  isOwner = false,
  onDelete,
  onPublish,
  onOpenReg,
  onCloseReg,
}) => {
  const {
    _id,
    title,
    theme,
    mode,
    venue,
    bannerImage,
    prizePool,
    maxTeamSize,
    registrationDeadline,
    status,
    isPublished,
  } = hackathon;

  const formattedDeadline = registrationDeadline
    ? new Date(registrationDeadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';

  const formattedPrize = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(prizePool || 0);

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-800/80 flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-300">
      <div>
        {/* Banner Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={bannerImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          {/* Top Status Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <StatusBadge status={status} isPublished={isOwner ? isPublished : undefined} />
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-slate-700/60">
              {mode}
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              {theme}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug truncate">
              {title}
            </h3>
          </div>
        </div>

        {/* Details List */}
        <div className="p-5 space-y-3 text-xs text-slate-300">
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Prize Pool */}
            <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Prize Pool</span>
                <span className="font-extrabold text-slate-100 text-sm">{formattedPrize}</span>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Deadline</span>
                <span className="font-bold text-slate-200">{formattedDeadline}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="flex items-center space-x-1.5 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{venue}</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-400 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Max {maxTeamSize}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link
            to={`/hackathons/${_id}`}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 text-center transition-colors flex items-center justify-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>

          {isOwner && (
            <>
              <Link
                to={`/organizer/assign-judges/${_id}`}
                className="p-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-colors"
                title="Assign Judges"
              >
                <UserCheck className="w-4 h-4" />
              </Link>
              <Link
                to={`/organizer/edit/${_id}`}
                className="p-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                title="Edit Hackathon"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete(_id, title)}
                className="p-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                title="Delete Hackathon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

        </div>

        {/* Organizer Controls: Publish & Registration Toggle */}
        {isOwner && (
          <div className="flex items-center gap-2 pt-1">
            {!isPublished && (
              <button
                onClick={() => onPublish(_id)}
                className="flex-1 py-1.5 rounded-lg text-[11px] font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 transition-colors flex items-center justify-center space-x-1"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Publish</span>
              </button>
            )}

            {status === 'Registration Open' ? (
              <button
                onClick={() => onCloseReg(_id)}
                className="flex-1 py-1.5 rounded-lg text-[11px] font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 transition-colors flex items-center justify-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Close Reg.</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenReg(_id)}
                className="flex-1 py-1.5 rounded-lg text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors flex items-center justify-center space-x-1"
              >
                <Unlock className="w-3 h-3" />
                <span>Open Reg.</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonCard;
