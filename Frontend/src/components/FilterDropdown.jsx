import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const FilterDropdown = ({
  selectedMode,
  onModeChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Mode Filter */}
      <div className="flex items-center space-x-2 glass-card px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
        <Filter className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-slate-400 font-medium">Mode:</span>
        <select
          value={selectedMode}
          onChange={(e) => onModeChange(e.target.value)}
          className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
        >
          <option value="All" className="bg-slate-900 text-white">All Modes</option>
          <option value="Online" className="bg-slate-900 text-white">Online</option>
          <option value="Offline" className="bg-slate-900 text-white">Offline</option>
          <option value="Hybrid" className="bg-slate-900 text-white">Hybrid</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-2 glass-card px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
        <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-slate-400 font-medium">Status:</span>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
        >
          <option value="All" className="bg-slate-900 text-white">All Statuses</option>
          <option value="Upcoming" className="bg-slate-900 text-white">Upcoming</option>
          <option value="Registration Open" className="bg-slate-900 text-white">Registration Open</option>
          <option value="Registration Closed" className="bg-slate-900 text-white">Registration Closed</option>
          <option value="Ongoing" className="bg-slate-900 text-white">Ongoing</option>
          <option value="Completed" className="bg-slate-900 text-white">Completed</option>
        </select>
      </div>

      {/* Sort By Dropdown */}
      <div className="flex items-center space-x-2 glass-card px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
        <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-slate-400 font-medium">Sort:</span>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
        >
          <option value="newest" className="bg-slate-900 text-white">Newest First</option>
          <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
          <option value="highestPrize" className="bg-slate-900 text-white">Highest Prize</option>
          <option value="deadline" className="bg-slate-900 text-white">Registration Deadline</option>
        </select>
      </div>
    </div>
  );
};

export default FilterDropdown;
