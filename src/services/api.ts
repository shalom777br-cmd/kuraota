import type { Recommendation, ReviewResponse, ComposerInfo, ReviewFormData, RecommendationFilters } from '../types';

const API_BASE = '/api';

export const apiService = {
  // Health check
  async checkHealth() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  },

  // Get music recommendations
  async getRecommendations(filters: RecommendationFilters): Promise<Recommendation[]> {
    const response = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  },

  // Get concert review draft
  async generateReviewDraft(formData: ReviewFormData): Promise<ReviewResponse> {
    const response = await fetch(`${API_BASE}/review-helper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to generate review');
    return response.json();
  },

  // Get composer information
  async getComposerInfo(composerName: string): Promise<ComposerInfo> {
    const response = await fetch(`${API_BASE}/composer-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ composerName }),
    });
    if (!response.ok) throw new Error('Failed to fetch composer info');
    return response.json();
  },
};
