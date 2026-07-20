import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { teamService } from '../services/teamService';
import toast from 'react-hot-toast';
import { Users, ArrowLeft, Key, PlusCircle, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import InviteCodeBox from '../components/InviteCodeBox';

const CreateTeam = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maxMembers: 4,
    },
  });

  const selectedHackathonId = watch('hackathonId');
  const selectedHackathon = hackathons.find((h) => h._id === selectedHackathonId);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await hackathonService.getAllHackathons({ status: 'Registration Open' });
        if (response.success) {
          setHackathons(response.hackathons || []);
        }
      } catch (err) {
        toast.error('Failed to load active hackathons');
      } finally {
        setLoadingHackathons(false);
      }
    };

    fetchHackathons();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        teamName: data.teamName,
        hackathonId: data.hackathonId,
        maxMembers: Number(data.maxMembers),
      };

      const response = await teamService.createTeam(payload);
      if (response.success) {
        toast.success('Team created successfully!');
        setCreatedTeam(response.team);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingHackathons) {
    return <LoadingSpinner fullScreen label="Loading hackathons for team creation..." />;
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {createdTeam ? (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/30 text-center space-y-6 shadow-2xl">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-block">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Team Created Successfully!</h2>
            <p className="text-sm text-slate-300">
              Your team <strong className="text-indigo-400">"{createdTeam.teamName}"</strong> is active. Share the invite code below with your teammates to let them join.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <InviteCodeBox code={createdTeam.inviteCode} />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/participant/my-team')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
            >
              Go to Team Workspace
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              <span>Create a New Hackathon Team</span>
            </h1>
            <p className="text-xs text-slate-400">
              Form a squad to collaborate and build projects together.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Team Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Team Name *
              </label>
              <input
                type="text"
                placeholder="e.g. CyberPunks 2026"
                {...register('teamName', {
                  required: 'Team name is required',
                  maxLength: { value: 50, message: 'Max length 50 chars' },
                })}
                className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                  errors.teamName ? 'border-red-500' : ''
                }`}
              />
              {errors.teamName && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.teamName.message}</p>
              )}
            </div>

            {/* Select Hackathon */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Hackathon *
              </label>
              <select
                {...register('hackathonId', { required: 'Please select a hackathon' })}
                className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-slate-900 focus:outline-none ${
                  errors.hackathonId ? 'border-red-500' : ''
                }`}
              >
                <option value="">-- Select Open Hackathon --</option>
                {hackathons.map((h) => (
                  <option key={h._id} value={h._id} className="bg-slate-900 text-white">
                    {h.title} (Max {h.maxTeamSize} members)
                  </option>
                ))}
              </select>
              {errors.hackathonId && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.hackathonId.message}</p>
              )}
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Maximum Team Members (including leader)
              </label>
              <input
                type="number"
                min="2"
                max={selectedHackathon ? selectedHackathon.maxTeamSize : 10}
                {...register('maxMembers', {
                  required: 'Max team members limit required',
                  min: { value: 2, message: 'Minimum 2 members' },
                  max: {
                    value: selectedHackathon ? selectedHackathon.maxTeamSize : 10,
                    message: `Event allows max ${selectedHackathon ? selectedHackathon.maxTeamSize : 10} members`,
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                  errors.maxMembers ? 'border-red-500' : ''
                }`}
              />
              {errors.maxMembers && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.maxMembers.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" label="" />
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Team & Generate Invite Code</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateTeam;
