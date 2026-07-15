import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSave?: (recommendation: Recommendation) => void;
  isSaving?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onSave,
  isSaving = false,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (onSave && !isSaving) {
      onSave(recommendation);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4">
        <h3 className="text-lg font-bold mb-1">{recommendation.title}</h3>
        <p className="text-sm opacity-90">{recommendation.composer}</p>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Era Badge */}
        <div>
          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
            {recommendation.era}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3">{recommendation.description}</p>

        {/* Movement */}
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600 font-medium mb-1">🎼 楽章</p>
          <p className="text-sm text-gray-800">{recommendation.movement}</p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
            isSaved
              ? 'bg-green-100 text-green-700'
              : 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart className={`w-5 h-5 ${
            isSaved ? 'fill-current' : ''
          }`} />
          {isSaved ? '保存しました' : '保存'}
        </button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
          詳細
        </button>
      </div>
    </div>
  );
};
