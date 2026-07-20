import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Award, Sparkles } from 'lucide-react';

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await reviewService.getReviewById(id);
        if (response.success) {
          setReview(response.review);
        }
      } catch (err) {
        toast.error('Failed to load evaluation details');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading evaluation details..." />;
  }

  if (!review) return null;

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white glass-card px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Detailed Evaluation Breakdown</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Review for "{review.submission?.projectName}"
        </h1>
      </div>

      {/* Review Card */}
      <ReviewCard review={review} />
    </div>
  );
};

export default ReviewDetails;
