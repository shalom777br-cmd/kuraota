import { supabase } from './supabase';
import type { ReviewFormData } from '../types';

export interface SavedReview {
  id: string;
  user_id: string;
  composer: string;
  piece: string;
  performance_date: string | null;
  venue: string | null;
  performer: string | null;
  notes: string;
  rating: number;
  review_title: string;
  review_text: string;
  highlight: string;
  suggestion: string;
  created_at: string;
}

export const reviewService = {
  // Save a review
  async saveReview(
    userId: string,
    formData: ReviewFormData,
    generatedReview: { title: string; reviewText: string; highlight: string; suggestion: string }
  ): Promise<SavedReview> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          user_id: userId,
          composer: formData.composer,
          piece: formData.piece,
          performance_date: formData.performanceDate || null,
          venue: formData.venue || null,
          performer: formData.performer || null,
          notes: formData.notes,
          rating: formData.rating,
          review_title: generatedReview.title,
          review_text: generatedReview.reviewText,
          highlight: generatedReview.highlight,
          suggestion: generatedReview.suggestion,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's reviews
  async getUserReviews(userId: string): Promise<SavedReview[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single review
  async getReview(reviewId: string): Promise<SavedReview> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update review
  async updateReview(reviewId: string, updates: Partial<SavedReview>): Promise<SavedReview> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete review
  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) throw error;
  },
};
