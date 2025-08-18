import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 font-medium"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 font-medium"
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 font-medium"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-xonora-primary-400"
            >
              Contact
            </a>
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-xonora-primary-400"
              >
                Dashboard
              </a>
            ) : null}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <a
                  href="/staking"
                  className="px-6 py-2 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 text-xonora-dark font-semibold rounded-lg hover:scale-105 transition-all duration-300"
                >
                  Stake Now
                </a>
                <button
                  onClick={logout}
                  className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-xonora-primary-400"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <a
                href="#home"
                className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#features"
                className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#faq"
                className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-xonora-primary-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              {isAuthenticated ? (
                <a
                  href="/dashboard"
                  className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-xonora-primary-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
              ) : null}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <a
                    href="/staking"
                    className="px-6 py-2 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 text-xonora-dark font-semibold rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Stake Now
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    login();
                    setIsMenuOpen(false);
                  }}
                  className="text-xonora-light hover:text-xonora-primary-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-xonora-primary-400 text-left"
                >
                  Connect Wallet
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
