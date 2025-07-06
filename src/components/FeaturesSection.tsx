
import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: "One-Click Staking",
      description: "Stake your Bitcoin with a single click. Our streamlined interface makes yield farming accessible to everyone, from beginners to experts.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="none" stroke="url(#clickGradient)" strokeWidth="4" />
          <circle cx="50" cy="50" r="8" fill="url(#clickGradient)" className="animate-pulse" />
          <path d="M30 30 L50 50 L70 30" stroke="url(#clickGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="clickGradient">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "AI-Optimized Yields",
      description: "Our advanced AI algorithms continuously monitor market conditions and optimize your yields 24/7 to maximize your Bitcoin returns.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="url(#aiGradient)" strokeWidth="3" />
          <circle cx="35" cy="35" r="3" fill="url(#aiGradient)" className="animate-pulse" />
          <circle cx="65" cy="35" r="3" fill="url(#aiGradient)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <path d="M30 60 Q50 45 70 60" stroke="url(#aiGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M40 75 L50 65 L60 75" stroke="url(#aiGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="aiGradient">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "Low Fees",
      description: "Keep more of your earnings with our industry-leading low fee structure. Only 0.1% management fee with no hidden costs or surprises.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="35" fill="none" stroke="url(#feeGradient)" strokeWidth="3" />
          <text x="50" y="45" textAnchor="middle" className="font-bold text-2xl" fill="url(#feeGradient)">$</text>
          <path d="M30 65 L40 55 L50 65 L60 55 L70 65" stroke="url(#feeGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M35 25 L50 35 L65 25" stroke="url(#feeGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="feeGradient">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="py-24 section-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-tech font-bold mb-6">
            Why Choose <span className="text-gradient">YieldBTC</span>?
          </h2>
          <p className="text-xl text-yield-gray-400 max-w-3xl mx-auto">
            Experience the future of Bitcoin yield farming with our cutting-edge features designed for maximum returns and minimum hassle.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-center mb-6 group-hover:animate-float">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-tech font-bold mb-4 text-center text-yield-green-400">
                {feature.title}
              </h3>
              
              <p className="text-yield-gray-400 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
