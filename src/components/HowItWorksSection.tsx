
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Connect Your Wallet",
      description: "Securely connect your Internet Identity wallet to access the Xonora platform and start your journey.",
      icon: "🔗"
    },
    {
      number: "2",
      title: "Deposit ckBTC",
      description: "Deposit your ckBTC into our secure smart contracts. Your funds remain under your control at all times.",
      icon: "₿"
    },
    {
      number: "3",
      title: "Choose Your Strategy",
      description: "Select from our AI-optimized yield farming strategies based on your risk tolerance and goals.",
      icon: "🎯"
    },
    {
      number: "4",
      title: "Earn Yields",
      description: "Watch your Bitcoin grow with our AI-powered optimization and 24/7 monitoring systems.",
      icon: "📈"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Xonora</span> Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our streamlined process makes Bitcoin yield farming accessible to everyone. Get started in minutes and start earning passive income.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 transform -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative bg-gray-800 rounded-xl p-8 text-center hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-8 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 text-xonora-dark font-tech font-bold text-lg px-4 py-2 rounded-full">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-6xl mb-6 mt-4">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-tech font-bold mb-4 text-center text-xonora-primary-400">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/staking"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 text-xonora-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-xonora-primary-400/25"
          >
            Start Your Journey
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
