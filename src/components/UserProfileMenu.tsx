import React from 'react';
import { User, Heart } from 'lucide-react';

interface UserProfileMenuProps {
  email: string;
  onProfileClick: () => void;
  onSignOut: () => Promise<void>;
  isLoading: boolean;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  email,
  onProfileClick,
  onSignOut,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <User className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-700 hidden sm:inline">{email.split('@')[0]}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-800">マイメニュー</p>
            <p className="text-xs text-gray-500 mt-1">{email}</p>
          </div>
          <button
            onClick={() => {
              onProfileClick();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User className="w-5 h-5" />
            <span>マイプロフィール</span>
          </button>
          <button
            onClick={async () => {
              await onSignOut();
              setIsOpen(false);
            }}
            disabled={isLoading}
            className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-t border-gray-200"
          >
            <span className="text-lg">→</span>
            <span>{isLoading ? 'サインアウト中...' : 'サインアウト'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
