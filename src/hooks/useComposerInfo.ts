import { useState } from 'react';
import type { ComposerInfo } from '../types';
import { apiService } from '../services/api';

export const useComposerInfo = () => {
  const [composerInfo, setComposerInfo] = useState<ComposerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComposerInfo = async (composerName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getComposerInfo(composerName);
      setComposerInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setComposerInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return { composerInfo, loading, error, fetchComposerInfo };
};
