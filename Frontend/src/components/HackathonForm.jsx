import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  Award, 
  Image as ImageIcon,
  Sparkles,
  Save
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const HackathonForm = ({ initialData = null, onSubmit, isSubmitting = false }) => {
  // Format Date ISO strings for datetime-local input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: formatDateForInput(initialData.startDate),
          endDate: formatDateForInput(initialData.endDate),
          registrationDeadline: formatDateForInput(initialData.registrationDeadline),
          submissionDeadline: formatDateForInput(initialData.submissionDeadline),
        }
      : {
          mode: 'Online',
          maxTeamSize: 4,
          prizePool: 5000,
          isPublished: true,
        },
  });

  const startDateValue = watch('startDate');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title & Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Hackathon Title *
          </label>
          <input
            type="text"
            placeholder="e.g. AI Innovation Summit 2026"
            {...register('title', { required: 'Hackathon title is required' })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-red-400 font-medium">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Theme / Focus Domain *
          </label>
          <input
            type="text"
            placeholder="e.g. Artificial Intelligence & Web3"
            {...register('theme', { required: 'Theme is required' })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.theme ? 'border-red-500' : ''
            }`}
          />
          {errors.theme && <p className="mt-1 text-xs text-red-400 font-medium">{errors.theme.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Description *
        </label>
        <textarea
          rows={4}
          placeholder="Detailed summary of the hackathon goals, target participants, and challenges..."
          {...register('description', { required: 'Description is required' })}
          className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
            errors.description ? 'border-red-500' : ''
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400 font-medium">{errors.description.message}</p>
        )}
      </div>

      {/* Mode, Venue & Banner Image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Mode *
          </label>
          <select
            {...register('mode', { required: 'Mode is required' })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-slate-900 focus:outline-none"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Venue / Platform URL *
          </label>
          <input
            type="text"
            placeholder="e.g. Discord / Tech Campus Arena"
            {...register('venue', { required: 'Venue details are required' })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.venue ? 'border-red-500' : ''
            }`}
          />
          {errors.venue && <p className="mt-1 text-xs text-red-400 font-medium">{errors.venue.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Banner Image URL
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            {...register('bannerImage')}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Registration Deadline *
          </label>
          <input
            type="datetime-local"
            {...register('registrationDeadline', {
              required: 'Registration deadline is required',
              validate: (val) => {
                if (startDateValue && new Date(val) >= new Date(startDateValue)) {
                  return 'Registration deadline must be before Start Date';
                }
                return true;
              },
            })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.registrationDeadline ? 'border-red-500' : ''
            }`}
          />
          {errors.registrationDeadline && (
            <p className="mt-1 text-xs text-red-400 font-medium">{errors.registrationDeadline.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Submission Deadline (Last Date to Submit Assignment) *
          </label>
          <input
            type="datetime-local"
            {...register('submissionDeadline', {
              required: 'Submission deadline is required',
              validate: (val) => {
                const regDeadlineVal = watch('registrationDeadline');
                if (regDeadlineVal && new Date(val) <= new Date(regDeadlineVal)) {
                  return 'Submission deadline must be after Registration Deadline';
                }
                return true;
              },
            })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.submissionDeadline ? 'border-red-500' : ''
            }`}
          />
          {errors.submissionDeadline && (
            <p className="mt-1 text-xs text-red-400 font-medium">{errors.submissionDeadline.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Start Date *
          </label>
          <input
            type="datetime-local"
            {...register('startDate', { required: 'Start date is required' })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.startDate ? 'border-red-500' : ''
            }`}
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-400 font-medium">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            End Date *
          </label>
          <input
            type="datetime-local"
            {...register('endDate', {
              required: 'End date is required',
              validate: (val) => {
                if (startDateValue && new Date(val) <= new Date(startDateValue)) {
                  return 'End date must be after Start Date';
                }
                return true;
              },
            })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.endDate ? 'border-red-500' : ''
            }`}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-400 font-medium">{errors.endDate.message}</p>}
        </div>
      </div>

      {/* Prize Pool & Max Team Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Prize Pool ($ USD) *
          </label>
          <input
            type="number"
            min="0"
            step="100"
            placeholder="10000"
            {...register('prizePool', {
              required: 'Prize pool amount is required',
              min: { value: 0, message: 'Prize pool cannot be negative' },
            })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.prizePool ? 'border-red-500' : ''
            }`}
          />
          {errors.prizePool && <p className="mt-1 text-xs text-red-400 font-medium">{errors.prizePool.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Maximum Team Size (2 - 10) *
          </label>
          <input
            type="number"
            min="2"
            max="10"
            placeholder="4"
            {...register('maxTeamSize', {
              required: 'Max team size is required',
              min: { value: 2, message: 'Minimum team size is 2' },
              max: { value: 10, message: 'Maximum team size is 10' },
            })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.maxTeamSize ? 'border-red-500' : ''
            }`}
          />
          {errors.maxTeamSize && (
            <p className="mt-1 text-xs text-red-400 font-medium">{errors.maxTeamSize.message}</p>
          )}
        </div>
      </div>

      {/* Rules & Judging Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Hackathon Rules *
          </label>
          <textarea
            rows={4}
            placeholder="1. Code must be written during the event.&#10;2. Plagiarism will lead to disqualification..."
            {...register('rules', { required: 'Rules are required' })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.rules ? 'border-red-500' : ''
            }`}
          />
          {errors.rules && <p className="mt-1 text-xs text-red-400 font-medium">{errors.rules.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Judging Criteria *
          </label>
          <textarea
            rows={4}
            placeholder="Innovation (30%), Technical Execution (40%), Design & UX (30%)..."
            {...register('judgingCriteria', { required: 'Judging criteria is required' })}
            className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
              errors.judgingCriteria ? 'border-red-500' : ''
            }`}
          />
          {errors.judgingCriteria && (
            <p className="mt-1 text-xs text-red-400 font-medium">{errors.judgingCriteria.message}</p>
          )}
        </div>
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <input
          type="checkbox"
          id="isPublished"
          {...register('isPublished')}
          className="w-5 h-5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <label htmlFor="isPublished" className="text-sm font-semibold text-white cursor-pointer select-none">
          Publish Hackathon immediately (makes visible to public participants)
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <LoadingSpinner size="sm" label="" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{initialData ? 'Update Hackathon' : 'Create Hackathon'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default HackathonForm;
