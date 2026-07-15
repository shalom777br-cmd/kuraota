import React from 'react';
import type { ReviewResponse } from '../types';
import { CheckCircle, Copy, Download } from 'lucide-react';

interface ReviewPreviewProps {
  review: ReviewResponse;
  onCopy?: () => void;
  onClear?: () => void;
}

export const ReviewPreview: React.FC<ReviewPreviewProps> = ({ review, onCopy, onClear }) => {
  const handleCopyToClipboard = () => {
    const text = `${review.title}\n\n${review.reviewText}\n\nハイライト: ${review.highlight}\n\nおすすめ: ${review.suggestion}`;
    navigator.clipboard.writeText(text);
    if (onCopy) onCopy();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">レビュー案が生成されました</h2>
      </div>

      {/* Title */}
      <div className="border-l-4 border-purple-600 pl-4">
        <h3 className="text-2xl font-bold text-gray-800">{review.title}</h3>
      </div>

      {/* Review Text */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{review.reviewText}</p>
      </div>

      {/* Highlight */}
      <div className="border-l-4 border-blue-600 pl-4">
        <p className="text-sm text-gray-600 font-semibold">ハイライト</p>
        <p className="text-gray-800">{review.highlight}</p>
      </div>

      {/* Suggestion */}
      <div className="border-l-4 border-emerald-600 pl-4">
        <p className="text-sm text-gray-600 font-semibold">おすすめ</p>
        <p className="text-gray-800">{review.suggestion}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center justify-center gap-2 flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Copy className="w-5 h-5" />
          コピー
        </button>
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-2 flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors"
        >
          <Download className="w-5 h-5" />
          クリア
        </button>
      </div>
    </div>
  );
};
