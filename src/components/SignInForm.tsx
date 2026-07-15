import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      await onSubmit(email, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'サインインに失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          パスワード
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Errors */}
      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error || localError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'サインイン中...' : 'サインイン'}
      </button>
    </form>
  );
};
