import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hackathonService } from '../services/hackathonService';
import { registrationService } from '../services/registrationService';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, Calendar, MapPin, Users, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const RegisterHackathon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [regStatus, setRegStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [hRes, rRes] = await Promise.all([
        hackathonService.getHackathonById(id),
        registrationService.getRegistrationStatus(id),
      ]);

      if (hRes.success) setHackathon(hRes.hackathon);
      if (rRes.success) setRegStatus(rRes);
    } catch (err) {
      toast.error('Failed to load event registration details');
      navigate('/hackathons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleRegister = async () => {
    setSubmitting(true);
    try {
      const response = await registrationService.registerHackathon(id);
      if (response.success) {
        toast.success(response.message || 'Successfully registered!');
        loadData();
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!regStatus?.registration?._id) return;
    setSubmitting(true);
    try {
      await registrationService.cancelRegistration(regStatus.registration._id);
      toast.success('Registration cancelled');
      loadData();
    } catch (err) {
      toast.error('Failed to cancel registration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Checking event registration portal..." />;
  }

  if (!hackathon) return null;

  const isRegistered = regStatus?.isRegistered;
  const currentReg = regStatus?.registration;
  const isRegistrationClosed = hackathon.status !== 'Registration Open';
  const isDeadlineCrossed = new Date() > new Date(hackathon.registrationDeadline);

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        {/* Banner Preview */}
        <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-900">
          <img
            src={hackathon.bannerImage}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block">
                {hackathon.theme}
              </span>
              <h1 className="text-2xl font-black text-white">{hackathon.title}</h1>
            </div>
            <StatusBadge status={hackathon.status} />
          </div>
        </div>

        {/* Status Indicator Panel */}
        {isRegistered ? (
          <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
            <div className="flex items-center space-x-3 text-indigo-300">
              <CheckCircle2 className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">You are Registered for this Hackathon</h3>
                <p className="text-xs text-slate-300">
                  Status: <StatusBadge status={currentReg.status} />
                </p>
              </div>
            </div>
            {currentReg.team && (
              <p className="text-xs text-purple-300 bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
                Assigned Team: <strong>{currentReg.team.teamName}</strong>
              </p>
            )}
          </div>
        ) : isRegistrationClosed || isDeadlineCrossed ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300">
            <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white">Registration Closed</h3>
              <p className="text-xs text-slate-300">
                {isDeadlineCrossed
                  ? 'The registration deadline for this hackathon has passed.'
                  : 'The organizer has closed registration for this event.'}
              </p>
            </div>
          </div>
        ) : null}

        {/* Hackathon Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold block uppercase mb-1">Prize Pool</span>
            <span className="text-lg font-black text-amber-400">${hackathon.prizePool?.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold block uppercase mb-1">Reg. Deadline</span>
            <span className="text-sm font-bold text-white">
              {new Date(hackathon.registrationDeadline).toLocaleDateString()}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold block uppercase mb-1">Team Size</span>
            <span className="text-sm font-bold text-white">Max {hackathon.maxTeamSize} Members</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex items-center space-x-4">
          {!isRegistered ? (
            <button
              onClick={handleRegister}
              disabled={submitting || isRegistrationClosed || isDeadlineCrossed}
              className="w-full py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <LoadingSpinner size="sm" label="" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Registration Now</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleCancel}
              disabled={submitting}
              className="w-full py-4 rounded-xl text-base font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <LoadingSpinner size="sm" label="" />
              ) : (
                <span>Cancel My Registration</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterHackathon;
