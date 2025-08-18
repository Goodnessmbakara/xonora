
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Bitcoin Investor",
      content: "Xonora has transformed my Bitcoin strategy. The AI optimization is incredible - I'm earning 12% APY consistently without any manual work.",
      avatar: "👨‍💼"
    },
    {
      name: "Michael Thompson",
      role: "DeFi Enthusiast",
      content: "I've tried many yield farming platforms, but Xonora's AI-driven yields are consistently the best. The platform is intuitive and the returns speak for themselves.",
      avatar: "👨‍💻"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Join thousands of users who are already maximizing their Bitcoin yields with Xonora
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-gray-800 rounded-xl p-8 hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="text-xonora-primary-400 text-4xl mb-6">
                "
              </div>

              {/* Content */}
              <p className="text-gray-300 leading-relaxed mb-6">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 rounded-full flex items-center justify-center text-xonora-dark font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/staking"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 text-xonora-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-xonora-primary-400/25"
          >
            Join Our Community
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
