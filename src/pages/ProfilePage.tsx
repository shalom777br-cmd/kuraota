import React, { useState, useEffect } from 'react';
import { Heart, Share2, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { reviewService, type SavedReview } from '../services/reviewService';
import { LoadingSpinner, ErrorMessage } from '../components';

export const ProfilePage: React.FC = () => {
  const { userId, email } = useAuth();
  const [reviews, setReviews] = useState<SavedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const loadReviews = async () => {
      try {
        setLoading(true);
        const userReviews = await reviewService.getUserReviews(userId);
        setReviews(userReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'レビューの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [userId]);

  const handleCopyReview = (review: SavedReview) => {
    const content = `${review.composer} - ${review.piece}\n\n${review.review_title}\n\n${review.review_text}`;
    navigator.clipboard.writeText(content);
    setCopiedId(review.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('このレビューを削除しますか?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'レビューの削除に失敗しました');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">マイプロフィール</h1>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-500 text-sm mt-2">投稿レビュー: {reviews.length}件</p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">まだレビューがありません</p>
            <p className="text-gray-500 text-sm mt-2">コンサートレビューを投稿してみましょう!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{review.review_title}</h3>
                    <p className="text-gray-600 text-sm">
                      {review.composer} - {review.piece}
                    </p>
                    {review.venue && (
                      <p className="text-gray-500 text-xs mt-1">📍 {review.venue}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyReview(review)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="コピー"
                    >
                      {copiedId === review.id ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-gray-700 text-sm line-clamp-3">{review.review_text}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-purple-50 rounded p-2">
                    <p className="text-gray-600 text-xs">ハイライト</p>
                    <p className="text-gray-800 font-medium">{review.highlight}</p>
                  </div>
                  <div className="bg-blue-50 rounded p-2">
                    <p className="text-gray-600 text-xs">評価</p>
                    <p className="text-gray-800 font-medium">{'⭐'.repeat(review.rating)}</p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mt-3">
                  投稿日: {new Date(review.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
