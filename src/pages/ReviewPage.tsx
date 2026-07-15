import React, { useState } from 'react';
import { Header, ErrorMessage, LoadingSpinner } from '../components';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewPreview } from '../components/ReviewPreview';
import { useReviewHelper } from '../hooks/useReviewHelper';
import type { ReviewFormData } from '../types';

export const ReviewPage: React.FC = () => {
  const { reviewDraft, loading, error, generateReviewDraft, clearReview } = useReviewHelper();
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleSubmit = async (formData: ReviewFormData) => {
    await generateReviewDraft(formData);
  };

  const handleCopy = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">コンサートレビュー</h1>
            <p className="text-gray-600">あなたのコンサート体験を素敵なレビューに変えましょう</p>
          </div>

          {/* Notifications */}
          {copiedNotification && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
              ✅ レビューをコピーしました！
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <ReviewForm onSubmit={handleSubmit} isLoading={loading} />
            </div>

            {/* Preview Section */}
            <div>
              {error && <ErrorMessage message={error} />}
              {loading && <LoadingSpinner />}
              {!loading && reviewDraft && (
                <ReviewPreview
                  review={reviewDraft}
                  onCopy={handleCopy}
                  onClear={clearReview}
                />
              )}
              {!loading && !reviewDraft && !error && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                  <p>フォームを入力してレビューを生成します</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
