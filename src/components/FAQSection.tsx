
import React, { useState } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is YieldBTC?",
      answer: "YieldBTC is an AI-powered Bitcoin yield farming platform built on the Internet Computer Protocol. We help you maximize your Bitcoin returns through automated, intelligent strategies while maintaining security and transparency."
    },
    {
      question: "How are yields generated?",
      answer: "Our AI algorithms analyze multiple DeFi protocols, liquidity pools, and staking opportunities across the Bitcoin ecosystem. We automatically allocate your funds to the highest-yielding, lowest-risk opportunities available."
    },
    {
      question: "What is ckBTC?",
      answer: "ckBTC (Chain-key Bitcoin) is a multi-chain Bitcoin twin that runs on the Internet Computer. It's backed 1:1 by Bitcoin and allows for fast, low-cost transactions while maintaining the security of the Bitcoin network."
    },
    {
      question: "How safe is my Bitcoin?",
      answer: "Security is our top priority. Your funds are protected by the Internet Computer's cryptographic security, multi-signature wallets, and regular security audits. We never have custody of your private keys."
    },
    {
      question: "What are the fees?",
      answer: "We charge a transparent 0.1% management fee on your earned yields. There are no hidden costs, withdrawal fees, or minimum balance requirements. You keep 99.9% of everything you earn."
    },
    {
      question: "Can I withdraw anytime?",
      answer: "Yes, you have full control over your funds. You can withdraw your Bitcoin anytime without penalties or lock-up periods. Withdrawals are typically processed within minutes."
    },
    {
      question: "How do I get started?",
      answer: "Simply connect your Internet Identity wallet, deposit ckBTC (or convert fiat using our MoonPay integration), and our AI will start optimizing your yields immediately. The entire process takes less than 5 minutes."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-yield-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-tech font-bold mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-yield-gray-400 max-w-3xl mx-auto">
            Get answers to common questions about YieldBTC and start your Bitcoin yield farming journey with confidence.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-800/70 transition-colors duration-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-yield-light">{faq.question}</h3>
                <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-yield-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-6">
                  <p className="text-yield-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
