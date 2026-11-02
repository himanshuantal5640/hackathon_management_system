import StatusBadge from './StatusBadge';
import TechStackBadge from './TechStackBadge';
import GithubIcon from './GithubIcon';
import { ExternalLink, Eye, Edit3, CheckCircle2 } from 'lucide-react';


const SubmissionCard = ({ submission, isLeader = false, onSubmitFinal }) => {
  const {
    _id,
    projectName,
    problemStatement,
    hackathon,
    team,
    projectLogo,
    githubRepository,
    liveDemoURL,
    techStack,
    status,
    submissionDate,
  } = submission;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-300">
      <div className="space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
          <span className="text-[11px] text-slate-400 font-mono">
            {new Date(submissionDate).toLocaleDateString()}
          </span>
        </div>

        {/* Project Header */}
        <div className="flex items-start space-x-3">
          <img
            src={
              projectLogo ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
            }
            alt={projectName}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30 flex-shrink-0"
          />
          <div className="overflow-hidden">
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
              {hackathon?.title || 'Hackathon Event'}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug truncate">
              {projectName}
            </h3>
            {team && <span className="text-xs text-slate-400">Team: {team.teamName}</span>}
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {problemStatement}
        </p>

        {/* Tech Stack Badges */}
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techStack.slice(0, 4).map((tech, idx) => (
              <TechStackBadge key={idx} name={tech} />
            ))}
            {techStack.length > 4 && (
              <span className="text-[10px] font-bold text-slate-500 self-center">
                +{techStack.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/60 space-y-3">
        {/* Repository & Demo links */}
        <div className="flex items-center space-x-2 text-xs">
          {githubRepository && (
            <a
              href={githubRepository}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center space-x-1.5 border border-slate-800"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

          )}
          {liveDemoURL && (
            <a
              href={liveDemoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 transition-colors flex items-center justify-center space-x-1.5 border border-slate-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/participant/submission/${_id}`}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors text-center flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Submission</span>
          </Link>

          {isLeader && status === 'Draft' && (
            <>
              <Link
                to={`/participant/submission/edit/${_id}`}
                className="p-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                title="Edit Draft"
              >
                <Edit3 className="w-4 h-4" />
              </Link>

              <button
                onClick={() => onSubmitFinal(_id)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all flex items-center gap-1"
                title="Submit Final"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
