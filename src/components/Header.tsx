
import React, { useState } from 'react';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Staking', href: '/staking' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yield-dark/95 backdrop-blur-sm border-b border-yield-gray-600">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-yield-light hover:text-yield-green-400 transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-yield-light hover:text-yield-green-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-yield-green-400">
              Internet Identity
            </button>
            <a href="/staking" className="btn-primary">
              Get Started
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-yield-light"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-yield-gray-600">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-yield-light hover:text-yield-green-400 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <button className="text-yield-light hover:text-yield-green-400 transition-colors duration-300 px-4 py-2 border border-yield-gray-600 rounded-lg hover:border-yield-green-400">
                  Internet Identity
                </button>
                <a href="/staking" className="btn-primary">
                  Get Started
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
