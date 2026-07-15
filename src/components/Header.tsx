import React from 'react';
import { Music } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-900 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex items-center gap-3">
        <Music className="w-8 h-8" />
        <div>
          <h1 className="text-3xl font-bold">L'harmonie Classique</h1>
          <p className="text-purple-200 text-sm">Classical Music Community</p>
        </div>
      </div>
    </header>
  );
};
