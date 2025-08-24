
import React, { useState } from 'react';
import BrandButton from './ui/BrandButton';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Xonora?",
      answer: "Xonora is an AI-powered Bitcoin yield farming platform that helps you maximize your Bitcoin returns through intelligent staking strategies and optimized yield generation. We use advanced algorithms to automatically optimize your yield farming positions for the best possible returns."
    },
    {
      question: "How does yield farming work?",
      answer: "Yield farming involves lending or staking your cryptocurrency to earn passive income. With Xonora, you deposit your ckBTC into our smart contracts, and our AI algorithms automatically optimize your positions across various DeFi protocols to maximize your returns."
    },
    {
      question: "What is ckBTC?",
      answer: "ckBTC (Chain-key Bitcoin) is a Bitcoin representation on the Internet Computer Protocol. It's a 1:1 backed Bitcoin that allows you to use Bitcoin in DeFi applications while maintaining the security and value of the original Bitcoin."
    },
    {
      question: "What are the risks involved?",
      answer: "Like all DeFi investments, yield farming carries risks including smart contract vulnerabilities, market volatility, and impermanent loss. However, Xonora implements multiple security measures and risk management strategies to minimize these risks."
    },
    {
      question: "How much can I earn?",
      answer: "Earnings depend on market conditions and your chosen strategy. Our AI-optimized strategies typically generate between 5-15% APY, though past performance doesn't guarantee future returns."
    },
    {
      question: "Is my Bitcoin safe?",
      answer: "Yes, your funds are secured by enterprise-grade smart contracts on the Internet Computer Protocol. We implement multiple security measures including audits, insurance, and real-time monitoring to protect your assets."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-xonora-secondary-700">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-tech">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-xonora-secondary-400 text-center mb-12 font-body">
            Get answers to common questions about Xonora
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-surface-900 rounded-lg mb-4 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-xonora-secondary-600 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-white pr-4 font-body">
                  {faq.question}
                </h3>
                <svg 
                  className={`w-6 h-6 text-xonora-primary-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-xonora-secondary-400 leading-relaxed font-body">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-xonora-secondary-400 mb-4 font-body">
            Still have questions? We're here to help!
          </p>
          <BrandButton
            href="#contact"
            variant="outline"
          >
            Contact Support
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </BrandButton>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
