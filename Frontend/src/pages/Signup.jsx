import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Trophy, 
  Users, 
  Award, 
  ShieldCheck 
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('participant');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'participant',
    },
  });

  const passwordValue = watch('password');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'participant',
        profileImage: data.profileImage || undefined,
      };

      await signup(payload);
      toast.success('Account created successfully! Welcome to HackPulse.');
      navigate('/profile', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rolesConfig = [
    { id: 'participant', label: 'Participant', icon: Users, desc: 'Build & Submit Projects' },
    { id: 'organizer', label: 'Organizer', icon: Trophy, desc: 'Host & Manage Hackathons' },
    { id: 'judge', label: 'Judge', icon: Award, desc: 'Evaluate Submissions' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 mb-2">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Your Account</h2>
          <p className="text-sm text-slate-400">
            Join the premier platform for developer hackathons
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Select Your Primary Role
            </label>
            <input type="hidden" {...register('role')} />
            <div className="grid grid-cols-3 gap-3">
              {rolesConfig.map((roleObj) => {
                const IconComp = roleObj.icon;
                const isSelected = selectedRole === roleObj.id;
                return (
                  <button
                    key={roleObj.id}
                    type="button"
                    onClick={() => handleRoleSelect(roleObj.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <IconComp className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold">{roleObj.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Alex Mercer"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                  errors.name ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="alex@hackpulse.dev"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/,
                      message: 'Must include letters, numbers, and special characters (e.g. Pass123!)',
                    },
                  })}
                  className={`w-full pl-11 pr-10 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                    errors.password ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>
              ) : (
                <p className="mt-1 text-[10px] text-slate-400 font-normal">Requires letters, numbers & special chars (e.g. Pass123!)</p>
              )}

            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === passwordValue || 'Passwords do not match',
                  })}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" label="" />
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 text-center border-t border-slate-800/80">
          <p className="text-sm text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign In instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
