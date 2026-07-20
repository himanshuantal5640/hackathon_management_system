import React, { useState, useEffect } from 'react';
import { registrationService } from '../services/registrationService';
import toast from 'react-hot-toast';
import { UserCheck, Sparkles, Filter } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import RegistrationCard from '../components/RegistrationCard';
import EmptyState from '../components/EmptyState';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchRegistrations = async () => {
    try {
      const response = await registrationService.getMyRegistrations();
      if (response.success) {
        setRegistrations(response.registrations || []);
      }
    } catch (err) {
      toast.error('Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (id) => {
    try {
      await registrationService.cancelRegistration(id);
      toast.success('Registration cancelled successfully');
      fetchRegistrations();
    } catch (err) {
      toast.error('Failed to cancel registration');
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (filterStatus === 'All') return r.status !== 'Cancelled';
    return r.status === filterStatus;
  });

  if (loading) {
    return <LoadingSpinner fullScreen label="Fetching your registrations..." />;
  }

  const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Registration History</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Hackathon Registrations</h1>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 glass-card p-1.5 rounded-2xl border border-slate-800">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Grid */}
      {filteredRegistrations.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No Registrations Found"
          description="You do not have any registrations matching this filter status."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((r) => (
            <RegistrationCard
              key={r._id}
              registration={r}
              onCancel={handleCancelRegistration}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
