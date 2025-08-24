
import React from 'react';
import BrandButton from './ui/BrandButton';

const QuickStartSection = () => {
  const steps = [
    {
      number: "1",
      title: "Connect Your Wallet",
      description: "Securely connect your Internet Identity wallet to access the Xonora platform and start your journey.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16" aria-hidden="true" role="presentation">
          <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
          <path
            d="M30 50 L45 35 L70 35 L70 65 L45 65 Z"
            fill="currentColor"
            opacity="0.8"
          />
          <circle cx="35" cy="50" r="3" fill="currentColor" />
          <circle cx="45" cy="50" r="3" fill="currentColor" />
          <circle cx="55" cy="50" r="3" fill="currentColor" />
        </svg>
      )
    },
    {
      number: "2",
      title: "Choose Your Pool",
      description: "Select from our AI-optimized yield farming pools with different risk profiles and APY rates.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16" aria-hidden="true" role="presentation">
          <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
          <circle cx="35" cy="40" r="8" fill="currentColor" opacity="0.6" />
          <circle cx="65" cy="40" r="8" fill="currentColor" opacity="0.6" />
          <circle cx="50" cy="60" r="8" fill="currentColor" opacity="0.6" />
          <path
            d="M35 40 L65 40 L50 60 Z"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      )
    },
    {
      number: "3",
      title: "Start Earning",
      description: "Deposit your ckBTC and watch your yields grow with our AI-powered optimization strategies.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16" aria-hidden="true" role="presentation">
          <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
          <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.2" />
          <text x="50" y="58" textAnchor="middle" className="font-bold text-2xl" fill="currentColor" opacity="0.8">₿</text>
          <path
            d="M50 25 L55 35 L65 35 L58 42 L62 50 L50 45 L38 50 L42 42 L35 35 L45 35 Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
      )
    }
  ];

  return (
    <section id="quick-start" className="py-20 bg-surface-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-xl text-xonora-secondary-400 text-center mb-12 font-body">
            Start earning Bitcoin yields in minutes with our streamlined process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-xonora-secondary-700 rounded-xl p-8 text-center hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Step Number */}
                              <div className="bg-gradient-to-r from-xonora-amber-400 to-xonora-amber-600 text-xonora-dark font-tech font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto">
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-xonora-primary-400 mb-6">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-tech font-bold mb-4 text-center text-xonora-primary-400">
                {step.title}
              </h3>
              <p className="text-xonora-secondary-400 text-center leading-relaxed font-body">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <BrandButton href="/staking">
            Start Earning Now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </BrandButton>
        </div>
      </div>
    </section>
  );
};

export default QuickStartSection;
