import React from 'react';

interface InstrumentFilterProps {
  instruments: string[];
  selectedInstrument: string | undefined;
  onInstrumentChange: (instrument: string) => void;
}

export const InstrumentFilter: React.FC<InstrumentFilterProps> = ({
  instruments,
  selectedInstrument,
  onInstrumentChange,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">楽器</label>
      <div className="flex flex-wrap gap-2">
        {instruments.map((instrument) => (
          <button
            key={instrument}
            onClick={() => onInstrumentChange(instrument)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedInstrument === instrument
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {instrument}
          </button>
        ))}
      </div>
    </div>
  );
};
