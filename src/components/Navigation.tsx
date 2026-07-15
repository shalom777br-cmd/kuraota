import React, { useState } from 'react';
import { Music, Search, MessageSquare, Users } from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';

type Page = 'recommendations' | 'review' | 'composer' | 'profile';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isAuthenticated: boolean;
  email?: string;
  onSignOut?: () => Promise<void>;
  isLoading?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  isAuthenticated,
  email,
  onSignOut,
  isLoading,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'recommendations', label: 'おすすめ', icon: <Music className="w-5 h-5" /> },
    { id: 'review', label: 'レビュー投稿', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'composer', label: '作曲家検索', icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-purple-600 font-bold text-lg">
            <Music className="w-6 h-6" />
            <span>L'harmonie</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu / Auth Status */}
          {isAuthenticated && email && onSignOut ? (
            <UserProfileMenu
              email={email}
              onProfileClick={() => onPageChange('profile')}
              onSignOut={onSignOut}
              isLoading={isLoading || false}
            />
          ) : null}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <div className="h-0.5 w-6 bg-gray-600"></div>
              <div className="h-0.5 w-6 bg-gray-600"></div>
              <div className="h-0.5 w-6 bg-gray-600"></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onPageChange('profile');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'profile'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              マイプロフィール
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
