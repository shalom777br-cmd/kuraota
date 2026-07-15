import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { RecommendationCard, SaveRecommendationModal } from '../components';
import type { Recommendation } from '../types';

interface RecommendationsPageProps {}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = () => {
  const { userId } = useAuth();
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock recommendations data
  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Symphony No. 9 in D minor',
      composer: 'Ludwig van Beethoven',
      era: 'Romantic',
      description: 'One of the greatest symphonies ever written, featuring the famous "Ode to Joy" in the final movement.',
      movement: 'IV. Presto - "Ode to Joy"',
    },
    {
      id: '2',
      title: 'The Four Seasons',
      composer: 'Antonio Vivaldi',
      era: 'Baroque',
      description: 'A set of four violin concerti, each depicting a different season of the year with vivid imagery.',
      movement: 'Spring: I. Allegro',
    },
    {
      id: '3',
      title: 'Moonlight Sonata',
      composer: 'Ludwig van Beethoven',
      era: 'Classical',
      description: 'One of the most famous piano pieces, known for its emotional depth and beautiful melody.',
      movement: 'I. Adagio sostenuto',
    },
    {
      id: '4',
      title: 'Eine kleine Nachtmusik',
      composer: 'Wolfgang Amadeus Mozart',
      era: 'Classical',
      description: 'A delightful and intimate chamber music composition that showcases Mozart\'s melodic genius.',
      movement: 'I. Allegro',
    },
    {
      id: '5',
      title: 'The Planets',
      composer: 'Gustav Holst',
      era: 'Modern',
      description: 'An orchestral suite depicting the astrological characteristics of the planets in our solar system.',
      movement: 'IV. Jupiter, the Bringer of Jollity',
    },
    {
      id: '6',
      title: 'Clair de lune',
      composer: 'Claude Debussy',
      era: 'Impressionist',
      description: 'A beautiful piano piece that evokes the image of moonlight filtering through the clouds.',
      movement: 'Solo piano work',
    },
  ];

  const handleSaveRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const handleSaveWithTitle = async (title: string) => {
    setIsSaving(true);
    try {
      // TODO: Implement save to database
      // await savedRecommendationService.saveRecommendation(userId, selectedRecommendation, title);
      console.log('Saving recommendation:', selectedRecommendation, 'with title:', title);
      // Success - modal will close
    } catch (err) {
      console.error('Failed to save recommendation:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">音楽おすすめ</h1>
          <p className="text-gray-600">あなたの好みに合わせた素晴らしいクラシック音楽をお探しください</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">時代</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>すべて</option>
                <option>Baroque</option>
                <option>Classical</option>
                <option>Romantic</option>
                <option>Modern</option>
                <option>Impressionist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">気分</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>すべて</option>
                <option>落ち着き</option>
                <option>エネルギッシュ</option>
                <option>ロマンチック</option>
                <option>瞑想的</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">楽器</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>すべて</option>
                <option>ピアノ</option>
                <option>ヴァイオリン</option>
                <option>オーケストラ</option>
                <option>弦楽器</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onSave={handleSaveRecommendation}
              isSaving={isSaving}
            />
          ))}
        </div>
      </div>

      {/* Save Modal */}
      {selectedRecommendation && (
        <SaveRecommendationModal
          recommendation={selectedRecommendation}
          onSave={handleSaveWithTitle}
          isLoading={isSaving}
          onClose={() => setSelectedRecommendation(null)}
        />
      )}
    </div>
  );
};
