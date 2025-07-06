
import React from 'react';

const QuickStartSection = () => {
  const steps = [
    {
      number: "1",
      title: "Connect Your Wallet",
      description: "Securely connect your Internet Identity wallet to access the YieldBTC platform and start your journey.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <rect x="20" y="30" width="60" height="40" rx="8" fill="none" stroke="url(#walletGradient)" strokeWidth="3" />
          <circle cx="30" cy="50" r="3" fill="url(#walletGradient)" />
          <path d="M40 45 L65 45 M40 55 L55 55" stroke="url(#walletGradient)" strokeWidth="2" strokeLinecap="round" />
          <path d="M75 40 L85 50 L75 60" stroke="url(#walletGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="walletGradient">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
          </defs>
        </svg>
      ),
      buttonText: "Connect Wallet",
      buttonAction: "/staking"
    },
    {
      number: "2",
      title: "Get ckBTC",
      description: "Purchase ckBTC using our MoonPay integration or deposit your existing Bitcoin to start earning yields.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="30" fill="none" stroke="url(#btcGradient)" strokeWidth="3" />
          <path d="M40 35 L40 65 M40 35 L50 35 Q55 35 55 40 Q55 45 50 45 L40 45 M40 45 L52 45 Q57 45 57 52.5 Q57 60 52 60 L40 60" stroke="url(#btcGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="45" y1="30" x2="45" y2="38" stroke="url(#btcGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="45" y1="62" x2="45" y2="70" stroke="url(#btcGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="50" y1="30" x2="50" y2="38" stroke="url(#btcGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="50" y1="62" x2="50" y2="70" stroke="url(#btcGradient)" strokeWidth="2" strokeLinecap="round"/>
          <defs>
            <linearGradient id="btcGradient">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
          </defs>
        </svg>
      ),
      buttonText: "Buy ckBTC",
      buttonAction: "#moonpay"
    },
    {
      number: "3",
      title: "Stake and Earn",
      description: "Choose your risk profile and stake your ckBTC to start earning up to 15% APY with our AI-optimized strategies.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <path d="M20 80 L30 60 L40 70 L50 50 L60 60 L70 30 L80 40" stroke="url(#growthGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M75 30 L80 40 L70 35" stroke="url(#growthGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="60" r="2" fill="url(#growthGradient)" />
          <circle cx="50" cy="50" r="2" fill="url(#growthGradient)" />
          <circle cx="70" cy="30" r="2" fill="url(#growthGradient)" />
          <defs>
            <linearGradient id="growthGradient">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
          </defs>
        </svg>
      ),
      buttonText: "Start Staking",
      buttonAction: "/staking"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-yield-dark to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-tech font-bold mb-6">
            How to <span className="text-gradient">Get Started</span>
          </h2>
          <p className="text-xl text-yield-gray-400 max-w-3xl mx-auto">
            Begin your Bitcoin yield farming journey in three simple steps. Start earning passive income today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Step Number */}
              <div className="bg-gradient-to-r from-yield-green-400 to-yield-green-600 text-yield-dark font-tech font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="flex justify-center mb-6 group-hover:animate-float">
                {step.icon}
              </div>
              
              <h3 className="text-2xl font-tech font-bold mb-4 text-center text-yield-green-400">
                {step.title}
              </h3>
              
              <p className="text-yield-gray-400 text-center leading-relaxed mb-6">
                {step.description}
              </p>
              
              <div className="text-center">
                <a
                  href={step.buttonAction}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yield-green-400 to-yield-green-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yield-green-400/25"
                >
                  {step.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStartSection;
