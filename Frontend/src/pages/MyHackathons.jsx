import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { Trophy, PlusCircle, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import HackathonCard from '../components/HackathonCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import DeleteModal from '../components/DeleteModal';
import EmptyState from '../components/EmptyState';

const MyHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyHackathons = async () => {
    try {
      const response = await hackathonService.getMyHackathons();
      if (response.success) {
        setHackathons(response.hackathons || []);
      }
    } catch (err) {
      toast.error('Failed to load your hackathons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHackathons();
  }, []);

  // Filter & Search local logic
  const filteredHackathons = hackathons
    .filter((h) => {
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = h.title?.toLowerCase().includes(query);
        const matchesTheme = h.theme?.toLowerCase().includes(query);
        const matchesVenue = h.venue?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTheme && !matchesVenue) return false;
      }
      if (selectedMode !== 'All' && h.mode !== selectedMode) return false;
      if (selectedStatus !== 'All' && h.status !== selectedStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (selectedSort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (selectedSort === 'highestPrize') {
        return b.prizePool - a.prizePool;
      }
      if (selectedSort === 'deadline') {
        return new Date(a.registrationDeadline) - new Date(b.registrationDeadline);
      }
      return new Date(b.createdAt) - new Date(a.createdAt); // newest default
    });

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await hackathonService.deleteHackathon(deleteModal.id);
      toast.success('Hackathon deleted successfully');
      setHackathons((prev) => prev.filter((h) => h._id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, title: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to delete hackathon');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await hackathonService.publishHackathon(id);
      toast.success('Hackathon published!');
      fetchMyHackathons();
    } catch (err) {
      toast.error('Failed to publish hackathon');
    }
  };

  const handleOpenReg = async (id) => {
    try {
      await hackathonService.openRegistration(id);
      toast.success('Registration opened');
      fetchMyHackathons();
    } catch (err) {
      toast.error('Failed to open registration');
    }
  };

  const handleCloseReg = async (id) => {
    try {
      await hackathonService.closeRegistration(id);
      toast.success('Registration closed');
      fetchMyHackathons();
    } catch (err) {
      toast.error('Failed to close registration');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Fetching your hackathons..." />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Managed Hackathons</h1>
        </div>

        <Link
          to="/organizer/create"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Hackathon</span>
        </Link>
      </div>

      {/* Controls: Search & Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="lg:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex justify-start lg:justify-end">
            <FilterDropdown
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
          </div>
        </div>
      </div>

      {/* Hackathons Grid */}
      {filteredHackathons.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Hackathons Found"
          description="You haven't created any hackathons matching these criteria."
          actionLabel="Create Hackathon"
          onAction={() => window.location.href = '/organizer/create'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((h) => (
            <HackathonCard
              key={h._id}
              hackathon={h}
              isOwner={true}
              onDelete={(id, title) => setDeleteModal({ isOpen: true, id, title })}
              onPublish={handlePublish}
              onOpenReg={handleOpenReg}
              onCloseReg={handleCloseReg}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.title}
        loading={isDeleting}
      />
    </div>
  );
};

export default MyHackathons;
