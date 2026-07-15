import React, { useState } from 'react';
import type { ReviewFormData } from '../types';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (formData: ReviewFormData) => Promise<void>;
  isLoading: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    composer: '',
    piece: '',
    performanceDate: '',
    venue: '',
    performer: '',
    notes: '',
    rating: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.composer && formData.piece) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Composer */}
        <div>
          <label htmlFor="composer" className="block text-sm font-semibold text-gray-700 mb-2">
            作曲家
          </label>
          <input
            id="composer"
            name="composer"
            type="text"
            value={formData.composer}
            onChange={handleChange}
            placeholder="e.g., Ludwig van Beethoven"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Piece */}
        <div>
          <label htmlFor="piece" className="block text-sm font-semibold text-gray-700 mb-2">
            曲名・プログラム
          </label>
          <input
            id="piece"
            name="piece"
            type="text"
            value={formData.piece}
            onChange={handleChange}
            placeholder="e.g., Symphony No. 9"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Performance Date */}
        <div>
          <label htmlFor="performanceDate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            公演日
          </label>
          <input
            id="performanceDate"
            name="performanceDate"
            type="date"
            value={formData.performanceDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Venue */}
        <div>
          <label htmlFor="venue" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            会場
          </label>
          <input
            id="venue"
            name="venue"
            type="text"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g., Tokyo Metropolitan Theater"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Performer */}
        <div>
          <label htmlFor="performer" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            演奏者・オーケストラ
          </label>
          <input
            id="performer"
            name="performer"
            type="text"
            value={formData.performer}
            onChange={handleChange}
            placeholder="e.g., Tokyo Symphony Orchestra"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            評価
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} / 5 ⭐
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
          感想・メモ（任意）
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="コンサートの感想や印象をメモしてください..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.composer || !formData.piece}
        className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'レビュー生成中...' : 'レビュー生成'}
      </button>
    </form>
  );
};
