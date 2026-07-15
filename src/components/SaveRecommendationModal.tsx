import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Recommendation } from '../types';

interface SaveRecommendationModalProps {
  recommendation: Recommendation;
  onSave: (title: string) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

export const SaveRecommendationModal: React.FC<SaveRecommendationModalProps> = ({
  recommendation,
  onSave,
  isLoading,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    try {
      await onSave(title);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">おすすめを保存</h2>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">曲</p>
          <p className="font-bold text-gray-800">{recommendation.title}</p>
          <p className="text-sm text-gray-600 mt-1">{recommendation.composer}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              タイトル（例：好きなクラシック曲）
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="このおすすめをカテゴリー分け"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
