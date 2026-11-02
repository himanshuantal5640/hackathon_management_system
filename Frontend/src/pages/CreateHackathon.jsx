import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import toast from 'react-hot-toast';
import { Trophy, ArrowLeft, Sparkles } from 'lucide-react';
import HackathonForm from '../components/HackathonForm';

import { socket } from '../services/socket';

const CreateHackathon = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await hackathonService.createHackathon(formData);
      if (response.success) {
        toast.success('Hackathon created successfully!');
        socket.emit('broadcastSystemNotification', {
          type: 'HACKATHON ADDED',
          message: `New event added: "${formData.title}"! Browse details in explore events.`
        });
        navigate('/organizer/my-hackathons');
      }

    } catch (err) {
      toast.error(err.message || 'Failed to create hackathon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create New Hackathon</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <HackathonForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateHackathon;
