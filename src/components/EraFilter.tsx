import React from 'react';

interface EraFilterProps {
  eras: string[];
  selectedEra: string | undefined;
  onEraChange: (era: string) => void;
}

export const EraFilter: React.FC<EraFilterProps> = ({
  eras,
  selectedEra,
  onEraChange,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">時代</label>
      <div className="flex flex-wrap gap-2">
        {eras.map((era) => (
          <button
            key={era}
            onClick={() => onEraChange(era)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedEra === era
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {era}
          </button>
        ))}
      </div>
    </div>
  );
};
