import React from 'react';
import type { ComposerInfo } from '../types';
import { Globe, Calendar, Music, Lightbulb, BookOpen } from 'lucide-react';

interface ComposerProfileProps {
  composer: ComposerInfo;
}

export const ComposerProfile: React.FC<ComposerProfileProps> = ({ composer }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-8">
        <h2 className="text-4xl font-bold mb-2">{composer.name}</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{composer.lifespan}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span>{composer.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            <span>{composer.era}</span>
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">経歴</h3>
            <p className="text-gray-700 leading-relaxed">{composer.biography}</p>
          </div>
        </div>
      </div>

      {/* Fun Fact */}
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">豆知識</h3>
            <p className="text-blue-800">{composer.funFact}</p>
          </div>
        </div>
      </div>

      {/* Key Pieces */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">代表作</h3>
        <div className="space-y-4">
          {composer.keyPieces.map((piece, idx) => (
            <div key={idx} className="border-l-4 border-emerald-600 pl-4 py-2">
              <h4 className="font-bold text-gray-800">{piece.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{piece.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
