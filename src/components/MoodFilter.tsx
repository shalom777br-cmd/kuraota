import React from 'react';

interface MoodFilterProps {
  moods: string[];
  selectedMood: string | undefined;
  onMoodChange: (mood: string) => void;
}

export const MoodFilter: React.FC<MoodFilterProps> = ({
  moods,
  selectedMood,
  onMoodChange,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">ムード</label>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => onMoodChange(mood)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedMood === mood
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
};
