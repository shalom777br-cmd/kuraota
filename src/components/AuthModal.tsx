import React, { useState } from 'react';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';

type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  onSignUp: (email: string, password: string, displayName: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onSignUp,
  onSignIn,
  isLoading,
  error,
}) => {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {mode === 'signin' ? 'サインイン' : 'アカウント作成'}
          </h2>
          <p className="text-gray-600 text-sm">
            {mode === 'signin'
              ? 'アカウントにログインしてください'
              : '新しいアカウントを作成してください'}
          </p>
        </div>

        {/* Forms */}
        {mode === 'signin' ? (
          <SignInForm onSubmit={onSignIn} isLoading={isLoading} error={error} />
        ) : (
          <SignUpForm onSubmit={onSignUp} isLoading={isLoading} error={error} />
        )}

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {mode === 'signin' ? 'アカウントをお持ちではありませんか？' : 'すでにアカウントをお持ちですか？'}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="ml-2 text-purple-600 font-bold hover:text-purple-700 transition-colors"
              disabled={isLoading}
            >
              {mode === 'signin' ? 'サインアップ' : 'サインイン'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
