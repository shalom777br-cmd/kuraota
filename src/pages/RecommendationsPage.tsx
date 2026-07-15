import React, { useState } from 'react';
import { Header, MoodFilter, InstrumentFilter, EraFilter, RecommendationCard, LoadingSpinner, ErrorMessage } from '../components';
import { useRecommendations } from '../hooks';

const MOODS = ['Relaxing', 'Energetic', 'Melancholic', 'Joyful', 'Dramatic'];
const INSTRUMENTS = ['Piano', 'Violin', 'Cello', 'Orchestra', 'String Quartet'];
const ERAS = ['Baroque', 'Classical', 'Romantic', 'Modern', 'Contemporary'];

export const RecommendationsPage: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | undefined>();
  const [selectedInstrument, setSelectedInstrument] = useState<string | undefined>();
  const [selectedEra, setSelectedEra] = useState<string | undefined>();
  const { recommendations, loading, error, fetchRecommendations } = useRecommendations();

  const handleSearch = async () => {
    await fetchRecommendations({
      mood: selectedMood,
      instrument: selectedInstrument,
      era: selectedEra,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800">フィルター</h2>
              <div className="space-y-6">
                <MoodFilter
                  moods={MOODS}
                  selectedMood={selectedMood}
                  onMoodChange={setSelectedMood}
                />
                <InstrumentFilter
                  instruments={INSTRUMENTS}
                  selectedInstrument={selectedInstrument}
                  onInstrumentChange={setSelectedInstrument}
                />
                <EraFilter
                  eras={ERAS}
                  selectedEra={selectedEra}
                  onEraChange={setSelectedEra}
                />
                <button
                  onClick={handleSearch}
                  className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  検索
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && <ErrorMessage message={error} />}
            {loading && <LoadingSpinner />}
            {!loading && recommendations.length === 0 && (
              <div className="text-center text-gray-600 py-12">
                <p>フィルターを選択して検索してください</p>
              </div>
            )}
            {!loading && recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, idx) => (
                  <RecommendationCard key={idx} recommendation={rec} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
