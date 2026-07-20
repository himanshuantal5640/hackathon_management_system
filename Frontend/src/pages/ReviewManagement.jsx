import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';
import { Award, Sparkles, Filter } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EvaluationTable from '../components/EvaluationTable';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

const ReviewManagement = () => {
  const { hackathonId } = useParams();
  const [myHackathons, setMyHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathonId || '');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Load organizer events
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await hackathonService.getMyHackathons();
        if (res.success && res.hackathons.length > 0) {
          setMyHackathons(res.hackathons);
          if (!selectedHackathonId) {
            setSelectedHackathonId(res.hackathons[0]._id);
          }
        }
      } catch (err) {
        toast.error('Failed to load organizer hackathons');
      }
    };

    fetchHackathons();
  }, []);

  // Fetch reviews when event or filters update
  const fetchReviews = async () => {
    if (!selectedHackathonId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await reviewService.getJudgeReviews({
        hackathonId: selectedHackathonId,
        status: selectedStatus,
      });
      if (res.success) {
        let list = res.reviews || [];
        if (searchQuery && searchQuery.trim() !== '') {
          const reg = new RegExp(searchQuery.trim(), 'i');
          list = list.filter(
            (r) =>
              reg.test(r.submission?.projectName) ||
              reg.test(r.submission?.team?.teamName) ||
              reg.test(r.judge?.name)
          );
        }
        setReviews(list);
      }
    } catch (err) {
      toast.error('Failed to load evaluations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedHackathonId, selectedStatus, searchQuery]);

  const handleLockReview = async (reviewId) => {
    setActionLoadingId(reviewId);
    try {
      await reviewService.lockReview(reviewId);
      toast.success('Evaluation LOCKED successfully');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to lock review');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer Evaluation Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Judge Review Management</h1>
        </div>

        {/* Hackathon Selector */}
        {myHackathons.length > 0 && (
          <div className="glass-card px-4 py-2 rounded-2xl border border-slate-800 flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Select Event:</span>
            <select
              value={selectedHackathonId}
              onChange={(e) => setSelectedHackathonId(e.target.value)}
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

      {/* Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by project name, team, or judge name..."
            />
          </div>

          <div className="flex justify-start md:justify-end">
            <div className="flex items-center space-x-2 glass-card px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 font-medium">Filter Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Statuses</option>
                <option value="Draft" className="bg-slate-900 text-white">Draft</option>
                <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                <option value="Locked" className="bg-slate-900 text-white">Locked</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <LoadingSpinner label="Fetching judge evaluations..." />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Judge Evaluations Found"
          description="There are no evaluations submitted for the selected event and filter status."
        />
      ) : (
        <EvaluationTable
          reviews={reviews}
          onLock={handleLockReview}
          loadingId={actionLoadingId}
        />
      )}
    </div>
  );
};

export default ReviewManagement;
