
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Connect your Internet Identity wallet securely to our platform in seconds.",
      icon: "🔗"
    },
    {
      number: "02",
      title: "Deposit ckBTC",
      description: "Deposit your ckBTC tokens or convert fiat to ckBTC using our MoonPay integration.",
      icon: "₿"
    },
    {
      number: "03",
      title: "AI Optimization",
      description: "Our AI algorithms analyze market conditions and automatically optimize your yield farming strategies.",
      icon: "🤖"
    },
    {
      number: "04",
      title: "Earn Yields",
      description: "Watch your Bitcoin grow with up to 15% APY while our system works 24/7 for you.",
      icon: "📈"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-yield-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-tech font-bold mb-6">
            How <span className="text-gradient">YieldBTC</span> Works
          </h2>
          <p className="text-xl text-yield-gray-400 max-w-3xl mx-auto">
            Get started with Bitcoin yield farming in four simple steps. Our streamlined process makes it easy for anyone to start earning yields.
          </p>
        </div>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-yield-green-400 to-yield-green-600 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 animate-fade-in z-10"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-8 bg-gradient-to-r from-yield-green-400 to-yield-green-600 text-yield-dark font-tech font-bold text-lg px-4 py-2 rounded-full">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="text-6xl mb-6 text-center">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-tech font-bold mb-4 text-center text-yield-green-400">
                  {step.title}
                </h3>
                
                <p className="text-yield-gray-400 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <button className="btn-primary text-lg">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
