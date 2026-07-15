import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { ReviewForm, ReviewPreview, SaveRecommendationModal } from '../components';
import type { ReviewFormData, ReviewResponse, Recommendation } from '../types';

export const ComposerPage: React.FC = () => {
  const [composerName, setComposerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement composer search
    setTimeout(() => {
      setLoading(false);
      setShowRecommendations(true);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">作曲家検索</h1>
        <p className="text-gray-600 mb-8">作曲家の情報と彼らの作品を探索します</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={composerName}
              onChange={(e) => setComposerName(e.target.value)}
              placeholder="作曲家の名前を入力...例: Bach, Mozart, Beethoven"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !composerName}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>
        </form>

        {/* Results */}
        {showRecommendations && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{composerName}</h2>
            <p className="text-gray-600 mb-4">
              {composerName}は世界で最も有名な作曲家の一人です。彼の作品は、音楽史に多大な影響を与えました。
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                詳細な情報と推奨作品はまもなく表示されます。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
