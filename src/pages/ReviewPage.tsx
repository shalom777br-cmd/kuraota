import React, { useState } from 'react';
import { Save, Download, AlertCircle } from 'lucide-react';
import { ReviewForm, ReviewPreview } from '../components';
import { useReviewHelper } from '../hooks/useReviewHelper';
import { useAuth } from '../hooks/useAuth';
import { reviewService } from '../services/reviewService';
import type { ReviewFormData, ReviewResponse } from '../types';

export const ReviewPage: React.FC = () => {
  const { userId } = useAuth();
  const { generateReview, loading: generating, error: generationError } = useReviewHelper();
  const [formData, setFormData] = useState<ReviewFormData | null>(null);
  const [generatedReview, setGeneratedReview] = useState<ReviewResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerateReview = async (data: ReviewFormData) => {
    setFormData(data);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const review = await generateReview(data);
      setGeneratedReview(review);
    } catch (err) {
      console.error('Failed to generate review:', err);
    }
  };

  const handleSaveReview = async () => {
    if (!userId || !formData || !generatedReview) {
      setSaveError('レビューを作成してください');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await reviewService.saveReview(userId, formData, {
        title: generatedReview.review_title,
        reviewText: generatedReview.review_text,
        highlight: generatedReview.highlight,
        suggestion: generatedReview.suggestion,
      });
      setSaveSuccess(true);
      setFormData(null);
      setGeneratedReview(null);
      // Reset form
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'レビューの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadReview = () => {
    if (!generatedReview || !formData) return;

    const content = `${formData.composer} - ${formData.piece}

${generatedReview.review_title}

${generatedReview.review_text}

ハイライト: ${generatedReview.highlight}
提案: ${generatedReview.suggestion}`;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', `review-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">コンサートレビュー投稿</h1>
        <p className="text-gray-600 mb-8">あなたの感想をAIが素晴らしいレビューに変換します</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <ReviewForm onSubmit={handleGenerateReview} isLoading={generating} />
          </div>

          {/* Preview Section */}
          <div>
            {generationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-800">エラーが発生しました</h3>
                  <p className="text-red-700 text-sm">{generationError}</p>
                </div>
              </div>
            )}

            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-800">保存エラー</h3>
                  <p className="text-red-700 text-sm">{saveError}</p>
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 font-bold">✓ レビューを保存しました!</p>
              </div>
            )}

            {generatedReview && (
              <>
                <ReviewPreview review={generatedReview} />

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveReview}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? '保存中...' : '保存'}
                  </button>
                  <button
                    onClick={handleDownloadReview}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    ダウンロード
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
