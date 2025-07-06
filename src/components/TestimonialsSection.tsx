
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Bitcoin Investor",
      content: "YieldBTC has transformed my Bitcoin strategy. The AI optimization is incredible - I'm earning 12% APY consistently while I sleep.",
      avatar: "AC"
    },
    {
      name: "Sarah Rodriguez",
      role: "DeFi Enthusiast",
      content: "Finally, a platform that makes Bitcoin yield farming simple. The one-click staking feature is a game-changer for busy professionals like me.",
      avatar: "SR"
    },
    {
      name: "Michael Thompson",
      role: "Crypto Trader",
      content: "The low fees and transparent approach won me over. I've tried many platforms, but YieldBTC's AI-driven yields are consistently the best.",
      avatar: "MT"
    }
  ];

  return (
    <section className="py-24 section-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-tech font-bold mb-6">
            What Our Users <span className="text-gradient">Say</span>
          </h2>
          <p className="text-xl text-yield-gray-400 max-w-3xl mx-auto">
            Join thousands of satisfied users who are already maximizing their Bitcoin yields with YieldBTC.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="text-yield-green-400 text-4xl mb-6">
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              
              <p className="text-yield-light mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yield-green-400 to-yield-green-600 rounded-full flex items-center justify-center text-yield-dark font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-yield-light">{testimonial.name}</div>
                  <div className="text-sm text-yield-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
