import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { submissionService } from '../services/submissionService';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';
import { UserCheck, Sparkles, CheckCircle2, UserPlus, Layers } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import JudgeCard from '../components/JudgeCard';
import EmptyState from '../components/EmptyState';

const AssignJudges = () => {
  const { hackathonId } = useParams();

  const [myHackathons, setMyHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathonId || '');
  const [submissions, setSubmissions] = useState([]);
  const [judges, setJudges] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState('');
  const [selectedJudgeIds, setSelectedJudgeIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load organizer events, judges pool, and active assignments
  const fetchInitialData = async () => {
    try {
      const [hRes, jRes] = await Promise.all([
        hackathonService.getMyHackathons(),
        reviewService.getAvailableJudges(),
      ]);

      if (hRes.success && hRes.hackathons.length > 0) {
        setMyHackathons(hRes.hackathons);
        if (!selectedHackathonId) {
          setSelectedHackathonId(hRes.hackathons[0]._id);
        }
      }

      if (jRes.success) {
        setJudges(jRes.judges || []);
      }
    } catch (err) {
      toast.error('Failed to load organizer events or judges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch submissions and assignments when selected hackathon changes
  const fetchSubmissionsAndAssignments = async () => {
    if (!selectedHackathonId) return;
    try {
      const [subRes, assignRes] = await Promise.all([
        submissionService.getHackathonSubmissions(selectedHackathonId),
        reviewService.getJudgeAssignments({ hackathonId: selectedHackathonId }),
      ]);

      if (subRes.success) {
        setSubmissions(subRes.submissions || []);
        if (subRes.submissions.length > 0 && !selectedSubmissionId) {
          setSelectedSubmissionId(subRes.submissions[0]._id);
        }
      }

      if (assignRes.success) {
        setAssignments(assignRes.assignments || []);
      }
    } catch (err) {
      toast.error('Failed to load hackathon submissions or active assignments');
    }
  };

  useEffect(() => {
    fetchSubmissionsAndAssignments();
  }, [selectedHackathonId]);

  const toggleJudgeSelection = (judgeId) => {
    setSelectedJudgeIds((prev) =>
      prev.includes(judgeId)
        ? prev.filter((id) => id !== judgeId)
        : [...prev, judgeId]
    );
  };

  const handleAssign = async () => {
    if (!selectedSubmissionId || selectedJudgeIds.length === 0) {
      toast.error('Please select both a project submission and at least one judge');
      return;
    }

    setSubmitting(true);
    try {
      // Assign all selected judges concurrently
      const results = await Promise.allSettled(
        selectedJudgeIds.map((judgeId) =>
          reviewService.assignJudge({
            submissionId: selectedSubmissionId,
            judgeId,
            hackathonId: selectedHackathonId,
          })
        )
      );

      // Check results
      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        toast.error('Some judge assignments failed or were already assigned.');
      } else {
        toast.success('All selected judges assigned successfully!');
      }

      setSelectedJudgeIds([]);
      // Refresh assignments to display newly assigned judge names immediately
      const assignRes = await reviewService.getJudgeAssignments({ hackathonId: selectedHackathonId });
      if (assignRes.success) {
        setAssignments(assignRes.assignments || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to assign judges');
    } finally {
      setSubmitting(false);
    }
  };

  const getAssignedJudgesForSubmission = (submissionId) => {
    return assignments
      .filter((a) => a.submission && a.submission._id === submissionId)
      .map((a) => a.judge?.name)
      .filter(Boolean);
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading judge assignment panel..." />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Assign Judges to Submissions</h1>
        </div>

        {/* Hackathon Selector */}
        {myHackathons.length > 0 && (
          <div className="glass-card px-4 py-2 rounded-2xl border border-slate-800 flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Select Event:</span>
            <select
              value={selectedHackathonId}
              onChange={(e) => {
                setSelectedHackathonId(e.target.value);
                setSelectedSubmissionId('');
                setSelectedJudgeIds([]);
              }}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
            >
              {myHackathons.map((h) => (
                <option key={h._id} value={h._id} className="bg-slate-900 text-white">
                  {h.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Project Submissions Found"
          description="There are no project submissions available in this event to assign judges to."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Submission Picker */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>1. Select Submission ({submissions.length})</span>
            </h3>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {submissions.map((sub) => {
                const isSelected = selectedSubmissionId === sub._id;
                const assignedJudges = getAssignedJudgesForSubmission(sub._id);
                return (
                  <div
                    key={sub._id}
                    onClick={() => setSelectedSubmissionId(sub._id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : 'glass-card border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          sub.projectLogo ||
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                        }
                        alt={sub.projectName}
                        className="w-9 h-9 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{sub.projectName}</h4>
                        <span className="text-xs text-slate-400 block mt-0.5">Team: {sub.team?.teamName}</span>
                      </div>
                    </div>

                    {/* Display assigned judge badges */}
                    {assignedJudges.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                          Assigned Judges:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {assignedJudges.map((name, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle & Right Col: Select Judge & Confirm */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>2. Select Judge to Assign</span>
              </h3>
              {selectedJudgeIds.length > 0 && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {selectedJudgeIds.length} Selected
                </span>
              )}
            </div>

            {judges.length === 0 ? (
              <p className="text-xs text-slate-400">No registered judges available in system.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
                {judges.map((j) => (
                  <JudgeCard
                    key={j._id}
                    judge={j}
                    isSelected={selectedJudgeIds.includes(j._id)}
                    onSelect={() => toggleJudgeSelection(j._id)}
                  />
                ))}
              </div>
            )}

            {/* Confirm Assignment CTA */}
            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleAssign}
                disabled={submitting || !selectedSubmissionId || selectedJudgeIds.length === 0}
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" label="" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Judge Assignment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignJudges;
