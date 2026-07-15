import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReviewPage } from './pages/ReviewPage';
import { ComposerPage } from './pages/ComposerPage';
import { useAuth } from './hooks/useAuth';

type Page = 'recommendations' | 'review' | 'composer';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('recommendations');
  const { userId, email, loading, error, isAuthenticated, signUp, signIn, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    await signUp(email, password, displayName);
    setShowAuthModal(false);
  };

  const handleSignIn = async (email: string, password: string) => {
    await signIn(email, password);
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowAuthModal(true);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return null;
    }

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
      {isAuthenticated && (
        <Navigation
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isAuthenticated={isAuthenticated}
          email={email || undefined}
          onSignOut={handleSignOut}
          isLoading={loading}
        />
      )}
      {renderPage()}
      {showAuthModal && (
        <AuthModal
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          isLoading={loading}
          error={error || undefined}
        />
      )}
    </div>
  );
}

export default App;
