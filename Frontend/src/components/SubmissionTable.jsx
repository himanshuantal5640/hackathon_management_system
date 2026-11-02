import React from 'react';
import StatusBadge from './StatusBadge';
import GithubIcon from './GithubIcon';
import { ExternalLink, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmissionTable = ({ submissions, onStatusChange, loadingId }) => {
  const statusOptions = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Project Name</th>
              <th className="py-4 px-6">Team & Leader</th>
              <th className="py-4 px-6">Submitted Date</th>
              <th className="py-4 px-6">Resources</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-slate-900/40 transition-colors">
                {/* Project Name & Logo */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        sub.projectLogo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={sub.projectName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">{sub.projectName}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {sub.problemStatement}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Team & Leader */}
                <td className="py-4 px-6">
                  <div>
                    <span className="font-bold text-indigo-300 block">
                      {sub.team?.teamName || 'Team'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Leader: {sub.submittedBy?.name}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-6 text-slate-400">
                  {new Date(sub.submissionDate).toLocaleDateString()}
                </td>

                {/* Resources: PDF, GitHub, Demo */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {sub.presentationPDF && (
                      <a
                        href={sub.presentationPDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Download Presentation PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    {sub.githubRepository && (
                      <a
                        href={sub.githubRepository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                        title="Open GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {sub.liveDemoURL && (
                      <a
                        href={sub.liveDemoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                        title="Open Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>


                {/* Status Badge */}
                <td className="py-4 px-6">
                  <StatusBadge status={sub.status} />
                </td>

                {/* Organizer Change Status Action */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/organizer/submissions/${sub._id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Full Inspection"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <select
                      value={sub.status}
                      disabled={loadingId === sub._id}
                      onChange={(e) => onStatusChange(sub._id, e.target.value)}
                      className="bg-slate-900 text-xs font-semibold text-white px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st} className="bg-slate-900 text-white">
                          {st}
                        </option>
                      ))}
                    </select>
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

export default SubmissionTable;
