import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

export default function Header() {
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Token Dashboard', href: '/token-dashboard' },
    { name: 'Transaction Monitoring', href: '/transaction-monitoring' },
    { name: 'User Analytics', href: '/user-analytics' },
    { name: 'Treasury & Tokenomics', href: '/treasury-tokenomics' },
    { name: 'Executive Overview', href: '/executive-overview' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">TokenApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation?.map((item) => {
              const isActive = location?.pathname === item?.href;
              return (
                <Link
                  key={item?.name}
                  to={item?.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item?.name}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-sm">
                  <span className="text-gray-700">Welcome, </span>
                  <span className="font-medium text-gray-900">
                    {userProfile?.full_name || user?.email?.split('@')?.[0]}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            <div className="space-y-1">
              {navigation?.map((item) => {
                const isActive = location?.pathname === item?.href;
                return (
                  <Link
                    key={item?.name}
                    to={item?.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item?.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}