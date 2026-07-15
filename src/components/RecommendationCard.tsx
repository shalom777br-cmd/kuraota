import React from 'react';
import type { Recommendation } from '../types';
import { Music } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <Music className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{recommendation.title}</h3>
          <p className="text-sm text-gray-600">by {recommendation.composer}</p>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
          {recommendation.era}
        </span>
      </div>
      <p className="text-gray-700 mb-3">{recommendation.description}</p>
      <div className="bg-gray-50 p-3 rounded">
        <p className="text-sm text-gray-600">
          <strong>Movement:</strong> {recommendation.movement}
        </p>
      </div>
    </div>
  );
};
