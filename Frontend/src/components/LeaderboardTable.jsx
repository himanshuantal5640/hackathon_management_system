import React from 'react';
import RankBadge from './RankBadge';
import { Award, Users, ExternalLink } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { Link } from 'react-router-dom';


const LeaderboardTable = ({ leaderboard }) => {
  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Rank</th>
              <th className="py-4 px-6">Team & Leader</th>
              <th className="py-4 px-6">Project Title</th>
              <th className="py-4 px-6">Avg Score (out of 70)</th>
              <th className="py-4 px-6">Judges</th>
              <th className="py-4 px-6">Standing Position</th>
              <th className="py-4 px-6 text-right">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leaderboard.map((item) => (
              <tr
                key={item._id}
                className={`transition-colors ${
                  item.rank === 1
                    ? 'bg-amber-500/5 hover:bg-amber-500/10'
                    : item.rank === 2
                    ? 'bg-slate-300/5 hover:bg-slate-300/10'
                    : item.rank === 3
                    ? 'bg-amber-700/5 hover:bg-amber-700/10'
                    : 'hover:bg-slate-900/40'
                }`}
              >
                {/* Rank */}
                <td className="py-4 px-6">
                  <RankBadge rank={item.rank} />
                </td>

                {/* Team & Leader */}
                <td className="py-4 px-6">
                  <div>
                    <span className="font-bold text-white text-sm block">
                      {item.team?.teamName || 'Team'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Leader: {item.team?.leader?.name}
                    </span>
                  </div>
                </td>

                {/* Project Title */}
                <td className="py-4 px-6">
                  <span className="font-semibold text-indigo-300">
                    {item.submission?.projectName || 'Project'}
                  </span>
                </td>

                {/* Avg Score */}
                <td className="py-4 px-6">
                  <span className="font-black text-indigo-300 font-mono bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20 inline-flex items-center gap-1.5 text-sm">
                    <Award className="w-4 h-4 text-amber-400" />
                    {item.averageScore} / 70
                  </span>
                </td>

                {/* Judge Count */}
                <td className="py-4 px-6 text-slate-400 font-medium">
                  {item.judgeCount} Judges
                </td>

                {/* Standing Position */}
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-slate-200 border border-slate-800">
                    {item.position}
                  </span>
                </td>

                {/* Links */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {item.submission?.githubRepository && (
                      <a
                        href={item.submission.githubRepository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {item.submission?.liveDemoURL && (
                      <a
                        href={item.submission.liveDemoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
