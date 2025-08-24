
import React, { useState } from 'react';
import { Mail, Twitter } from 'lucide-react'; // Added imports for Mail and Twitter icons
import BrandButton from './ui/BrandButton';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-xonora-secondary-700">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-tech">
            Get in Touch
          </h2>
          <p className="text-xl text-xonora-secondary-400 text-center mb-12 font-body">
            Have questions about Xonora? We're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-surface-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-white font-tech">
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-xonora-secondary-300 mb-2 font-body">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-xonora-secondary-600 border border-xonora-secondary-500 rounded-lg text-white placeholder-xonora-secondary-400 focus:outline-none focus:border-xonora-primary-400 focus:ring-2 focus:ring-xonora-primary-400/20 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-xonora-secondary-300 mb-2 font-body">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-xonora-secondary-600 border border-xonora-secondary-500 rounded-lg text-white placeholder-xonora-secondary-400 focus:outline-none focus:border-xonora-primary-400 focus:ring-2 focus:ring-xonora-primary-400/20 transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-xonora-secondary-300 mb-2 font-body">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-xonora-secondary-600 border border-xonora-secondary-500 rounded-lg text-white placeholder-xonora-secondary-400 focus:outline-none focus:border-xonora-primary-400 focus:ring-2 focus:ring-xonora-primary-400/20 resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              
              <BrandButton
                type="submit"
                className="w-full"
              >
                Send Message
              </BrandButton>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-surface-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-xonora-primary-400 mb-6 font-tech">
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-xonora-primary-400" />
                <a
                  href="mailto:xonora25@gmail.com"
                  className="text-xonora-secondary-300 hover:text-xonora-primary-400 transition-colors font-body"
                >
                  xonora25@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Twitter className="w-5 h-5 text-xonora-primary-400" />
                <a
                  href="https://x.com/Xonora_btc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xonora-secondary-300 hover:text-xonora-primary-400 transition-colors font-body"
                >
                  @xonora_btc
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-xonora-secondary-700 rounded-lg">
              <h4 className="font-semibold text-white mb-3 font-body">Support Hours</h4>
              <p className="text-xonora-secondary-400 text-sm font-body">
                Monday - Friday: 9:00 AM - 6:00 PM UTC<br />
                Weekend: 10:00 AM - 4:00 PM UTC
              </p>
            </div>

            <div className="mt-6 p-6 bg-xonora-secondary-700 rounded-lg">
              <h4 className="font-semibold text-white mb-3 font-body">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#faq" className="block text-xonora-secondary-400 hover:text-xonora-primary-400 transition-colors font-body">
                  FAQ
                </a>
                <a href="/staking" className="block text-xonora-secondary-400 hover:text-xonora-primary-400 transition-colors font-body">
                  Start Staking
                </a>
                <a href="#how-it-works" className="block text-xonora-secondary-400 hover:text-xonora-primary-400 transition-colors font-body">
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
