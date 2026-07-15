import { useState } from 'react';
import type { ReviewFormData, ReviewResponse } from '../types';
import { apiService } from '../services/api';

export const useReviewHelper = () => {
  const [reviewDraft, setReviewDraft] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReviewDraft = async (formData: ReviewFormData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.generateReviewDraft(formData);
      setReviewDraft(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setReviewDraft(null);
    } finally {
      setLoading(false);
    }
  };

  const clearReview = () => {
    setReviewDraft(null);
    setError(null);
  };

  return { reviewDraft, loading, error, generateReviewDraft, clearReview };
};
