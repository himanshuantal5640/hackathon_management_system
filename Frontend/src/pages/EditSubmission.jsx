import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { submissionService } from '../services/submissionService';
import toast from 'react-hot-toast';
import { Edit3, ArrowLeft, Save, UploadCloud } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import UploadBox from '../components/UploadBox';
import FilePreview from '../components/FilePreview';

const EditSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File states
  const [logoFile, setLogoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await submissionService.getSubmissionById(id);
        if (response.success) {
          setSubmission(response.submission);
          reset({
            projectName: response.submission.projectName,
            problemStatement: response.submission.problemStatement,
            solution: response.submission.solution,
            description: response.submission.description,
            githubRepository: response.submission.githubRepository,
            liveDemoURL: response.submission.liveDemoURL || '',
            techStack: response.submission.techStack?.join(', ') || '',
            demoVideoURL: response.submission.demoVideoURL || '',
          });
        }
      } catch (err) {
        toast.error('Failed to load submission');
        navigate('/participant/my-submission');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id, reset, navigate]);

  const handleUpdate = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('projectName', data.projectName);
      formData.append('problemStatement', data.problemStatement);
      formData.append('solution', data.solution);
      formData.append('description', data.description);
      formData.append('githubRepository', data.githubRepository);
      formData.append('liveDemoURL', data.liveDemoURL || '');
      formData.append('techStack', data.techStack || '');
      formData.append('demoVideoURL', data.demoVideoURL || '');

      if (pdfFile) formData.append('presentationPDF', pdfFile);
      if (logoFile) formData.append('projectLogo', logoFile);
      screenshotFiles.forEach((f) => formData.append('screenshots', f));

      const response = await submissionService.updateSubmission(id, formData);
      if (response.success) {
        toast.success('Submission updated successfully!');
        navigate('/participant/my-submission');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading project submission..." />;
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
            <span>Edit Submission</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Edit "{submission?.projectName}"
          </h1>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Project Name *
            </label>
            <input
              type="text"
              {...register('projectName', { required: 'Project name is required' })}
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                errors.projectName ? 'border-red-500' : ''
              }`}
            />
          </div>

          {/* GitHub Repo */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              GitHub Repository URL *
            </label>
            <input
              type="url"
              {...register('githubRepository', { required: 'GitHub URL is required' })}
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none ${
                errors.githubRepository ? 'border-red-500' : ''
              }`}
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Problem Statement *
            </label>
            <textarea
              rows={3}
              {...register('problemStatement', { required: 'Problem statement required' })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Proposed Solution *
            </label>
            <textarea
              rows={3}
              {...register('solution', { required: 'Solution required' })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              {...register('techStack')}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          {/* Replace Files section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Replace Uploads (Optional)</h3>

            <UploadBox
              label="Replace Presentation PDF"
              accept="application/pdf"
              onChange={setPdfFile}
            />
            {pdfFile && <FilePreview file={pdfFile} onRemove={() => setPdfFile(null)} />}

            <UploadBox
              label="Replace Project Logo"
              accept="image/*"
              onChange={setLogoFile}
            />
            {logoFile && <FilePreview file={logoFile} onRemove={() => setLogoFile(null)} />}
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" label="" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Edits</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubmission;
