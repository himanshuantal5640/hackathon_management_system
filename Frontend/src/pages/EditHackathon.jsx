import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit3 } from 'lucide-react';
import HackathonForm from '../components/HackathonForm';
import LoadingSpinner from '../components/LoadingSpinner';

const EditHackathon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await hackathonService.getHackathonById(id);
        if (response.success) {
          setHackathon(response.hackathon);
        }
      } catch (err) {
        toast.error('Failed to load hackathon details');
        navigate('/organizer/my-hackathons');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await hackathonService.updateHackathon(id, formData);
      if (response.success) {
        toast.success('Hackathon updated successfully!');
        navigate('/organizer/my-hackathons');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update hackathon');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading hackathon configuration..." />;
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Event Config</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Edit "{hackathon?.title}"
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <HackathonForm
          initialData={hackathon}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditHackathon;
