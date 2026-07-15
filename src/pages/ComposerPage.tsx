import React from 'react';
import { Header, ErrorMessage, LoadingSpinner } from '../components';
import { ComposerSearchForm } from '../components/ComposerSearchForm';
import { ComposerProfile } from '../components/ComposerProfile';
import { useComposerInfo } from '../hooks';

export const ComposerPage: React.FC = () => {
  const { composerInfo, loading, error, fetchComposerInfo } = useComposerInfo();

  const handleSearch = async (composerName: string) => {
    await fetchComposerInfo(composerName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">作曲家検索</h1>
            <p className="text-gray-600">クラシック音楽の大作曲家たちについて学びましょう</p>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <ComposerSearchForm onSearch={handleSearch} isLoading={loading} />
          </div>

          {/* Results */}
          {error && <ErrorMessage message={error} />}
          {loading && <LoadingSpinner />}
          {!loading && composerInfo && <ComposerProfile composer={composerInfo} />}
          {!loading && !composerInfo && !error && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 text-lg">
                <p>作曲家を検索して、彼らの人生と音楽について探索してください</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
