import { useState } from 'react';
import type { Recommendation, RecommendationFilters } from '../types';
import { apiService } from '../services/api';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (filters: RecommendationFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getRecommendations(filters);
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, error, fetchRecommendations };
};
