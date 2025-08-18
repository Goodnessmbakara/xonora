
import React, { useState } from 'react';
import { Mail, Twitter } from 'lucide-react'; // Added imports for Mail and Twitter icons

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
    <section id="contact" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Have questions about Xonora? We're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-gray-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-white">
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-xonora-primary-400 focus:ring-2 focus:ring-xonora-primary-400/20 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-xonora-primary-400 focus:ring-2 focus:ring-xonora-primary-400/20 transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-xonora-primary-400 focus:ring-2 focus:ring-xonora-primary-400/20 resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 text-xonora-dark font-semibold rounded-lg hover:scale-105 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-xonora-primary-400 mb-6">
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-xonora-primary-400" />
                <a
                  href="mailto:hello@xonora.io"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  hello@xonora.io
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Twitter className="w-5 h-5 text-xonora-primary-400" />
                <a
                  href="https://twitter.com/Xonora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  @Xonora
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-white mb-3">Support Hours</h4>
              <p className="text-gray-400 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM UTC<br />
                Weekend: 10:00 AM - 4:00 PM UTC
              </p>
            </div>

            <div className="mt-6 p-6 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#faq" className="block text-gray-400 hover:text-xonora-primary-400 transition-colors">
                  FAQ
                </a>
                <a href="/staking" className="block text-gray-400 hover:text-xonora-primary-400 transition-colors">
                  Start Staking
                </a>
                <a href="#how-it-works" className="block text-gray-400 hover:text-xonora-primary-400 transition-colors">
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
