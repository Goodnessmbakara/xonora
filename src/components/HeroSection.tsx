
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import IdentityConnection from './IdentityConnection';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-xonora-dark via-xonora-dark to-xonora-dark flex items-center justify-center overflow-hidden">
      {/* Floating Bitcoin symbols */}
      <div className="absolute top-20 left-20 text-xonora-primary-400 text-2xl animate-float">₿</div>
      <div className="absolute top-40 right-32 text-xonora-primary-400 text-xl animate-float" style={{ animationDelay: '1s' }}>₿</div>
      <div className="absolute bottom-40 left-40 text-xonora-primary-400 text-lg animate-float" style={{ animationDelay: '2s' }}>₿</div>
      <div className="absolute bottom-20 right-20 text-xonora-primary-400 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>₿</div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 bg-clip-text text-transparent font-tech">
            Maximize Your Bitcoin Yields with Xonora
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
            Earn up to <span className="text-xonora-primary-400 font-semibold">15% APY</span> with our AI-optimized yield farming platform on the Internet Computer Protocol.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <a
                href="/staking"
                className="px-8 py-4 bg-gradient-to-r from-xonora-amber-400 to-xonora-amber-600 text-xonora-dark rounded-lg font-semibold hover:scale-105 transition-all duration-300 font-body"
              >
                Start Earning Now
              </a>
            ) : (
              <IdentityConnection />
            )}
            <a
              href="#features"
              className="px-8 py-4 border-2 border-xonora-secondary-600 text-xonora-light rounded-lg font-semibold hover:border-xonora-amber-400 hover:text-xonora-amber-400 transition-all duration-300 font-body"
            >
              Learn More
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-tech font-bold text-xonora-primary-400">15%</div>
              <div className="text-xonora-secondary-400 mt-2 font-body">Max APY</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-tech font-bold text-xonora-primary-400">0.1%</div>
              <div className="text-xonora-secondary-400 mt-2 font-body">Low Fees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-tech font-bold text-xonora-primary-400">24/7</div>
              <div className="text-xonora-secondary-400 mt-2 font-body">AI Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
