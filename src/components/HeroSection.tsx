
import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      
      {/* Floating Bitcoin Symbols */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 text-yield-green-400 text-2xl animate-float">₿</div>
        <div className="absolute top-40 right-32 text-yield-green-400 text-xl animate-float" style={{ animationDelay: '1s' }}>₿</div>
        <div className="absolute bottom-40 left-40 text-yield-green-400 text-lg animate-float" style={{ animationDelay: '2s' }}>₿</div>
        <div className="absolute bottom-20 right-20 text-yield-green-400 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>₿</div>
      </div>
      
      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-tech font-bold leading-tight">
              Maximize Your{' '}
              <span className="text-gradient">Bitcoin Yields</span>{' '}
              with YieldBTC
            </h1>
            
            <p className="text-xl text-yield-gray-400 leading-relaxed max-w-lg">
              Earn up to <span className="text-yield-green-400 font-semibold">15% APY</span> with our AI-optimized yield farming platform on the Internet Computer Protocol.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/staking" className="btn-primary text-lg">
                Get Started
              </a>
              <button className="px-8 py-4 border-2 border-yield-green-400 text-yield-green-400 rounded-lg font-semibold hover:bg-yield-green-400 hover:text-yield-dark transition-all duration-300">
                Buy ckBTC with MoonPay
              </button>
            </div>
            
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-tech font-bold text-yield-green-400">15%</div>
                <div className="text-sm text-yield-gray-400">Max APY</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-tech font-bold text-yield-green-400">0.1%</div>
                <div className="text-sm text-yield-gray-400">Low Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-tech font-bold text-yield-green-400">24/7</div>
                <div className="text-sm text-yield-gray-400">AI Monitoring</div>
              </div>
            </div>
          </div>
          
          {/* Custom Bitcoin Tree Illustration */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <svg viewBox="0 0 400 400" className="w-full max-w-md h-auto">
                {/* Tree trunk */}
                <rect x="190" y="300" width="20" height="80" fill="url(#trunkGradient)" rx="10" />
                
                {/* Main branches */}
                <path d="M200 320 Q150 280 120 240" stroke="url(#branchGradient)" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M200 320 Q250 280 280 240" stroke="url(#branchGradient)" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M200 300 Q200 250 200 200" stroke="url(#branchGradient)" strokeWidth="10" fill="none" strokeLinecap="round" />
                
                {/* Secondary branches */}
                <path d="M200 200 Q170 170 140 150" stroke="url(#branchGradient)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M200 200 Q230 170 260 150" stroke="url(#branchGradient)" strokeWidth="6" fill="none" strokeLinecap="round" />
                
                {/* Bitcoin symbols as fruits */}
                <g className="animate-float">
                  <circle cx="140" cy="150" r="25" fill="url(#bitcoinGradient)" />
                  <text x="140" y="158" textAnchor="middle" className="font-bold text-xl" fill="#121212">₿</text>
                </g>
                
                <g className="animate-float" style={{ animationDelay: '0.5s' }}>
                  <circle cx="260" cy="150" r="25" fill="url(#bitcoinGradient)" />
                  <text x="260" y="158" textAnchor="middle" className="font-bold text-xl" fill="#121212">₿</text>
                </g>
                
                <g className="animate-float" style={{ animationDelay: '1s' }}>
                  <circle cx="120" cy="240" r="20" fill="url(#bitcoinGradient)" />
                  <text x="120" y="247" textAnchor="middle" className="font-bold text-lg" fill="#121212">₿</text>
                </g>
                
                <g className="animate-float" style={{ animationDelay: '1.5s' }}>
                  <circle cx="280" cy="240" r="20" fill="url(#bitcoinGradient)" />
                  <text x="280" y="247" textAnchor="middle" className="font-bold text-lg" fill="#121212">₿</text>
                </g>
                
                <g className="animate-float" style={{ animationDelay: '0.8s' }}>
                  <circle cx="200" cy="120" r="30" fill="url(#bitcoinGradient)" />
                  <text x="200" y="130" textAnchor="middle" className="font-bold text-2xl" fill="#121212">₿</text>
                </g>
                
                {/* Leaves */}
                <g className="animate-float" style={{ animationDelay: '0.3s' }}>
                  <ellipse cx="160" cy="130" rx="8" ry="15" fill="url(#leafGradient)" transform="rotate(-30 160 130)" />
                  <ellipse cx="240" cy="130" rx="8" ry="15" fill="url(#leafGradient)" transform="rotate(30 240 130)" />
                  <ellipse cx="100" cy="220" rx="6" ry="12" fill="url(#leafGradient)" transform="rotate(-45 100 220)" />
                  <ellipse cx="300" cy="220" rx="6" ry="12" fill="url(#leafGradient)" transform="rotate(45 300 220)" />
                </g>
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="bitcoinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34C759" />
                    <stop offset="100%" stopColor="#22A447" />
                  </linearGradient>
                  <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34C759" />
                    <stop offset="100%" stopColor="#22A447" />
                  </linearGradient>
                  <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6B7280" />
                    <stop offset="100%" stopColor="#4B5563" />
                  </linearGradient>
                  <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6B7280" />
                    <stop offset="100%" stopColor="#4B5563" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
