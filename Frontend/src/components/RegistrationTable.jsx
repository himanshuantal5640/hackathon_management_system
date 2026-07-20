import React from 'react';
import StatusBadge from './StatusBadge';
import { CheckCircle2, XCircle, User, Users, Calendar } from 'lucide-react';

const RegistrationTable = ({ registrations, onApprove, onReject, loadingId }) => {
  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Participant</th>
              <th className="py-4 px-6">Registered Date</th>
              <th className="py-4 px-6">Team</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Approval Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {registrations.map((reg) => (
              <tr key={reg._id} className="hover:bg-slate-900/40 transition-colors">
                {/* Participant User Info */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        reg.participant?.profileImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={reg.participant?.name || 'User'}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">
                        {reg.participant?.name || 'Deleted User'}
                      </p>
                      <p className="text-[11px] text-slate-400">{reg.participant?.email}</p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-6 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
                  </div>
                </td>

                {/* Team */}
                <td className="py-4 px-6">
                  {reg.team ? (
                    <span className="font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {reg.team.teamName}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">Solo Participant</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <StatusBadge status={reg.status} />
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {reg.status !== 'Approved' && (
                      <button
                        onClick={() => onApprove(reg._id)}
                        disabled={loadingId === reg._id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {reg.status !== 'Rejected' && (
                      <button
                        onClick={() => onReject(reg._id)}
                        disabled={loadingId === reg._id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
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

export default RegistrationTable;
