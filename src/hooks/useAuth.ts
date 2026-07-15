import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check current user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUserId(user.userId);
          setEmail(user.email);
        }
      } catch (err) {
        console.error('Failed to check user:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen to auth changes
    const subscription = authService.onAuthStateChange((newUserId, newEmail) => {
      setUserId(newUserId);
      setEmail(newEmail);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signUp(email, password, displayName);
      setUserId(result.userId);
      setEmail(result.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signIn(email, password);
      setUserId(result.userId);
      setEmail(result.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signOut();
      setUserId(null);
      setEmail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userId,
    email,
    loading,
    error,
    isAuthenticated: !!userId,
    signUp,
    signIn,
    signOut,
  };
};
