
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
            <p className="text-gray-400 max-w-md">
              Xonora is an AI-powered Bitcoin yield farming platform that helps you maximize your Bitcoin returns through intelligent staking strategies and optimized yield generation.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:hello@xonora.io"
                className="text-gray-400 hover:text-white transition-colors"
              >
                hello@xonora.io
              </a>
              <a
                href="https://twitter.com/Xonora"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                @Xonora
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
              <p className="text-yield-gray-400">hello@xonora.io</p>
              <p className="text-yield-gray-400">Discord Community</p>
              <p className="text-yield-gray-400">@Xonora</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2024 Xonora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
