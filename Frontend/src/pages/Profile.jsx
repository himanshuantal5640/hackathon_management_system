import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Image as ImageIcon,
  Lock,
  Sparkles,
  Award
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      profileImage: user?.profileImage || '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        password: '',
      });
    }
  }, [user, reset]);

  const onUpdateSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
      };
      if (data.password && data.password.trim().length > 0) {
        payload.password = data.password;
      }

      await updateProfile(payload);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'organizer':
        return { label: 'Organizer', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'judge':
        return { label: 'Judge', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'Participant', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner Card */}
      <div className="relative glass-panel rounded-3xl overflow-hidden border border-slate-800 p-6 sm:p-10 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-2xl"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h1>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border uppercase tracking-wide ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>

            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>{user?.email}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Joined {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Account Active
              </span>
            </div>
          </div>

          {/* Toggle Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 glass-card hover:bg-slate-800 border border-slate-700 flex items-center space-x-2 transition-all"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Info / Edit Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Role Capability Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Role Permissions</span>
          </div>

          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            {user?.role} Privileges
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Your permissions on HackPulse are governed by your assigned platform role.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Access Protected Dashboards', allowed: true },
              { label: 'Submit Hackathon Projects', allowed: user?.role === 'participant' || user?.role === 'admin' },
              { label: 'Host & Manage Competitions', allowed: user?.role === 'organizer' || user?.role === 'admin' },
              { label: 'Judge & Score Submissions', allowed: user?.role === 'judge' || user?.role === 'admin' },
              { label: 'System Admin Console', allowed: user?.role === 'admin' },
            ].map((perm, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-300 font-medium">{perm.label}</span>
                {perm.allowed ? (
                  <span className="text-emerald-400 font-bold">Granted</span>
                ) : (
                  <span className="text-slate-600 font-bold">Restricted</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Details / Edit Form */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>{isEditing ? 'Update Profile Details' : 'Account Overview'}</span>
          </h2>

          {isEditing ? (
            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  {...register('profileImage')}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>

              {/* New Password (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" label="" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                    Display Name
                  </span>
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                    Registered Email
                  </span>
                  <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                    Assigned Role
                  </span>
                  <p className="text-sm font-bold text-indigo-400 uppercase tracking-wide">
                    {user?.role}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                    Security Status
                  </span>
                  <p className="text-sm font-bold text-emerald-400">
                    JWT Verified Cookie / Bearer
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
