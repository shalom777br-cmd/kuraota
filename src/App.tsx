import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReviewPage } from './pages/ReviewPage';
import { ComposerPage } from './pages/ComposerPage';

type Page = 'recommendations' | 'review' | 'composer';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('recommendations');

  const renderPage = () => {
    switch (currentPage) {
      case 'recommendations':
        return <RecommendationsPage />;
      case 'review':
        return <ReviewPage />;
      case 'composer':
        return <ComposerPage />;
      default:
        return <RecommendationsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
