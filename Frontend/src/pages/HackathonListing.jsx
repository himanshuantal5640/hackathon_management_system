import React, { useState, useEffect } from 'react';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { Trophy, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import HackathonCard from '../components/HackathonCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import EmptyState from '../components/EmptyState';

const HackathonListing = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');

  const fetchPublicHackathons = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        mode: selectedMode,
        status: selectedStatus,
        sort: selectedSort,
      };
      const response = await hackathonService.getAllHackathons(params);
      if (response.success) {
        setHackathons(response.hackathons || []);
      }
    } catch (err) {
      toast.error('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicHackathons();
  }, [searchQuery, selectedMode, selectedStatus, selectedSort]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Hero */}
      <div className="text-center space-y-3 max-w-2xl mx-auto py-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Public Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explore Active <span className="gradient-text">Hackathons</span>
        </h1>
        <p className="text-sm text-slate-400">
          Discover world-class hackathons, form teams, build innovative software, and win prizes.
        </p>
      </div>

      {/* Search & Filter Bar */}
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

      {/* Grid */}
      {loading ? (
        <LoadingSpinner label="Searching hackathons..." />
      ) : hackathons.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Published Hackathons Found"
          description="Try adjusting your search terms or filter selections."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((h) => (
            <HackathonCard key={h._id} hackathon={h} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonListing;
