import React from 'react';
import RankBadge from './RankBadge';
import { Trophy, Crown, ExternalLink } from 'lucide-react';
import GithubIcon from './GithubIcon';


const WinnerCard = ({ place = 1, team, submission }) => {
  if (!team && !submission) return null;

  const title = submission?.projectName || 'Winning Project';
  const teamName = team?.teamName || 'Team';
  const leaderName = team?.leader?.name || 'Leader';

  const cardBorder =
    place === 1
      ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 shadow-2xl shadow-amber-500/10'
      : place === 2
      ? 'border-slate-400/50 bg-gradient-to-b from-slate-400/10 via-slate-900 to-slate-950 shadow-xl'
      : 'border-amber-700/50 bg-gradient-to-b from-amber-700/10 via-slate-900 to-slate-950 shadow-xl';

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border ${cardBorder} space-y-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
      <div className="space-y-4">
        {/* Top Trophy Header */}
        <div className="flex items-center justify-between">
          <RankBadge rank={place} />
          {place === 1 && <Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />}
        </div>

        {/* Project & Team Details */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
            Team: {teamName}
          </span>
          <h3 className="text-2xl font-black text-white leading-tight">{title}</h3>
          <p className="text-xs text-slate-400">Led by {leaderName}</p>
        </div>

        {submission?.problemStatement && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {submission.problemStatement}
          </p>
        )}
      </div>

      {/* Footer Links */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center space-x-3 text-xs">
        {submission?.githubRepository && (
          <a
            href={submission.githubRepository}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center space-x-1.5 border border-slate-800 font-semibold"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        )}
        {submission?.liveDemoURL && (
          <a
            href={submission.liveDemoURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors flex items-center justify-center space-x-1.5 border border-indigo-500/20 font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default WinnerCard;
