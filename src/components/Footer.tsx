
import React from 'react';
import Logo from './Logo';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' }
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Risk Disclosure', href: '#' },
    { label: 'Security', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 border-t border-yield-gray-600">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-yield-gray-400 text-sm leading-relaxed">
              Maximize your Bitcoin yields with AI-powered optimization on the Internet Computer Protocol.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-yield-gray-400 hover:text-yield-green-400 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-yield-gray-400 hover:text-yield-green-400 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-tech font-bold text-yield-light mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-yield-gray-400 hover:text-yield-green-400 transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-tech font-bold text-yield-light mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-yield-gray-400 hover:text-yield-green-400 transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-tech font-bold text-yield-light mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <p className="text-yield-gray-400">hello@yieldbtc.io</p>
              <p className="text-yield-gray-400">Discord Community</p>
              <p className="text-yield-gray-400">@YieldBTC</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-yield-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-yield-gray-400 text-sm">
            © 2024 YieldBTC. All rights reserved.
          </p>
          <p className="text-yield-gray-400 text-sm mt-4 md:mt-0">
            Built on the Internet Computer Protocol
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
