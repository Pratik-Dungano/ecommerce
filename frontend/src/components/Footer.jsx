import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin, ChevronUp, Star, Heart, ShoppingBag } from 'lucide-react';

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Replace these with your actual contact details
  const phoneNumber = "+911234567890";
  const emailAddress = "info@adaajaipur.com";
  const googleMapsLink = "https://maps.app.goo.gl/MENEJjSk6QzKB7uc7";

  return (
    <footer className="relative bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-pink-700 to-green-600" />

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-all group animate-bounce"
      >
        <ChevronUp className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px]' : 'max-h-24'}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-green-400 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">ADAA JAIPUR</h2>
            <div className="flex space-x-4 mt-3 md:mt-0">
              <a href="#" className="text-pink-700 hover:text-gray-800 transform hover:scale-110 transition-all"><Instagram /></a>
              <a href="#" className="text-pink-700 hover:text-gray-800 transform hover:scale-110 transition-all"><Facebook /></a>
              <a href="#" className="text-pink-700 hover:text-gray-800 transform hover:scale-110 transition-all"><Twitter /></a>
            </div>
            <div className="flex items-center space-x-6 mt-3 md:mt-0">
              <a href={`tel:${phoneNumber}`} className="text-green-600 hover:text-green-700"><Phone size={20} /></a>
              <a href={`mailto:${emailAddress}`} className="text-green-600 hover:text-green-700"><Mail size={20} /></a>
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700"><MapPin size={20} /></a>
            </div>
          </div>

          <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-4">About Our Collection</h3>
              <p className="text-gray-600">
                Discover the richness of Jaipur's traditional craftsmanship through our carefully curated collection.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <Star className="text-pink-700" size={16} />
                <span className="text-gray-800">4.9/5 Customer Rating</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <a href="https://adaa-jaipur-ein-bin-tin.vercel.app/" className="text-gray-600 hover:text-pink-700 transition-colors">Home</a>
                <a href="https://adaa-jaipur-ein-bin-tin.vercel.app/about" className="text-gray-600 hover:text-pink-700 transition-colors">About</a>
                <a href="https://adaa-jaipur-ein-bin-tin.vercel.app/collection" className="text-gray-600 hover:text-pink-700 transition-colors">Collections</a>
                <a href="https://adaa-jaipur-ein-bin-tin.vercel.app/contact" className="text-gray-600 hover:text-pink-700 transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-4">Why Choose Us</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="text-pink-700" />
                  <span className="text-gray-600">Premium Quality Fabrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="text-pink-700" />
                  <span className="text-gray-600">Handcrafted with Love</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="text-pink-700" />
                  <span className="text-gray-600">Authentic Jaipuri Designs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-4 border-t border-green-400">
            <p className="text-sm text-gray-500">Copyright © 2025 @Ein-Bin-Tin - All Rights Reserved.</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-pink-700 to-green-600" />
    </footer>
  );
};

export default Footer;