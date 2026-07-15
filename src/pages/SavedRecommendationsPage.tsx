import React from 'react';
import type { Recommendation } from '../types';

export interface SavedRecommendation extends Recommendation {
  savedTitle: string;
  savedAt: string;
}

interface SavedRecommendationsPageProps {}

export const SavedRecommendationsPage: React.FC<SavedRecommendationsPageProps> = () => {
  // TODO: Implement saved recommendations page
  // This page will display all saved recommendations by the user

  const savedRecommendations: SavedRecommendation[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">保存したおすすめ</h1>
        <p className="text-gray-600 mb-8">あなたが保存したクラシック音楽の推奨事項</p>

        {savedRecommendations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">まだ保存したおすすめがありません</p>
            <p className="text-gray-500 text-sm mt-2">気に入った曲を保存してみましょう!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
