import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin, ChevronUp, Star, Heart, ShoppingBag } from 'lucide-react';

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Replace these with your actual contact details
  const phoneNumber = "+911234567890"; // Replace with your shop's phone number
  const emailAddress = "info@adaajaipur.com"; // Replace with your shop's email
  const googleMapsLink = "https://maps.app.goo.gl/MENEJjSk6QzKB7uc7"; // Replace with your shop's Google Maps link

  return (
    <footer className="relative bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-pink-700 to-green-600" />
      
      {/* Expand/Collapse Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-all group animate-bounce"
      >
        <ChevronUp className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Main Footer Content */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-24'}`}>
        <div className="container mx-auto px-4">
          {/* Compact View (Always Visible) */}
          <div className="h-24 flex items-center justify-between border-b border-green-400">
            <div className="flex items-center space-x-8">
              <h2 className="text-2xl font-bold text-gray-800">ADAA JAIPUR</h2>
              <div className="flex space-x-4">
                <a href="#" className="text-pink-700 hover:text-gray-800 transform hover:scale-110 transition-all">
                  <Instagram />
                </a>
                <a href="#" className="text-pink-700 hover:text-gray-800 transform hover:scale-110 transition-all">
                  <Facebook />
                </a>
                <a href="#" className="text-pink-700 hover:text-gray-800 transform hover:scale-110 transition-all">
                  <Twitter />
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Phone Icon */}
              <a href={`tel:${phoneNumber}`} className="text-green-600 hover:text-green-700">
                <Phone size={20} />
              </a>
              {/* Mail Icon */}
              <a href={`mailto:${emailAddress}`} className="text-green-600 hover:text-green-700">
                <Mail size={20} />
              </a>
              {/* Map Icon */}
              <a 
                href={googleMapsLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-green-600 hover:text-green-700"
              >
                <MapPin size={20} />
              </a>
            </div>
          </div>

          {/* Expanded Content */}
          <div className="py-8">
            <div className="flex justify-between items-start">
              {/* About Section */}
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-green-700 mb-4">About Our Collection</h3>
                <p className="text-gray-600">
                  Discover the richness of Jaipur's traditional craftsmanship through our carefully curated collection 
                  of authentic clothing. Each piece tells a story of heritage, artistry, and timeless elegance.
                </p>
                <div className="mt-4 flex items-center space-x-2">
                  <Star className="text-pink-700" size={16} />
                  <span className="text-gray-800">4.9/5 Customer Rating</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex space-x-12">
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-4">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <a href="https://ecommerce-frontend-neon-theta.vercel.app/" className="text-gray-600 hover:text-pink-700 transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all" />
                      Home
                    </a>
                    <a href="https://ecommerce-frontend-neon-theta.vercel.app/about" className="text-gray-600 hover:text-pink-700 transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all" />
                      About
                    </a>
                    <a href="https://ecommerce-frontend-neon-theta.vercel.app/collection" className="text-gray-600 hover:text-pink-700 transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all" />
                      Collections
                    </a>
                    <a href="https://ecommerce-frontend-neon-theta.vercel.app/contact" className="text-gray-600 hover:text-pink-700 transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all" />
                      Contact
                    </a>
                  </div>
                </div>

                {/* Features Section (Replacing Newsletter) */}
                <div className="max-w-sm">
                  <h3 className="text-lg font-semibold text-green-700 mb-4">Why Choose Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 group">
                      <ShoppingBag className="text-pink-700 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Premium Quality Fabrics</span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                      <Heart className="text-pink-700 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Handcrafted with Love</span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                      <Star className="text-pink-700 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Authentic Jaipuri Designs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center py-4 border-t border-green-400">
            <p className="text-sm text-gray-500">
              Copyright © 2025 @Ein-Bin-Tin  --All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-pink-700 to-green-600" />
    </footer>
  );
};

export default Footer;