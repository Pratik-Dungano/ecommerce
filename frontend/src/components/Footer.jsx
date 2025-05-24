import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { assets } from "../assets/assets";
import { ShopContext } from '../context/ShopContext';

const Footer = () => {
  const phoneNumber = "+918800174972";
  const emailAddress = "ORDERS@ADAAJAIPUR.COM";
  const address = "H-5, RIICO Industrial Area, Mansarovar, Jaipur, Rajasthan 302020";
  const { categories } = useContext(ShopContext);
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getTopCategories = () => {
    if (!categories || categories.length === 0) {
      return [
        { name: "New Arrivals", slug: "new-arrivals" },
        { name: "Kurtas", slug: "kurtas" },
        { name: "Sarees", slug: "sarees" },
        { name: "Gowns", slug: "gowns" },
        { name: "Lehengas", slug: "lehengas" }
      ];
    }

    return categories
      .filter(cat => cat.active)
      .slice(0, 6)
      .map(cat => ({
        name: cat.name,
        slug: cat.slug
      }));
  };

  return (
    <footer className="relative bg-amber-50 font-serif">
      <div 
        className="absolute inset-0 bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${assets.footer_1})`, backgroundSize: "cover", height: "100%", width: "100%" }}
      />
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-600 via-amber-500 to-pink-600" />

      <div className="container mx-auto px-4 py-6 pb-2">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-amber-300 pb-4 relative">
          <div className="absolute left-0 top-0 opacity-10 w-24 h-24">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,10 C70,10 85,25 90,50 C85,75 70,90 50,90 C30,90 15,75 10,50 C15,25 30,10 50,10 Z" fill="none" stroke="#D97706" strokeWidth="2" />
              <path d="M50,20 C65,20 75,35 80,50 C75,65 65,80 50,80 C35,80 25,65 20,50 C25,35 35,20 50,20 Z" fill="none" stroke="#D97706" strokeWidth="2" />
              <path d="M50,30 C60,30 65,40 70,50 C65,60 60,70 50,70 C40,70 35,60 30,50 C35,40 40,30 50,30 Z" fill="none" stroke="#D97706" strokeWidth="2" />
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-pink-700">ADAA JAIPUR</h2>

          <div className="flex space-x-3 mt-3 md:mt-0">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-amber-600 transform hover:scale-110 transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-amber-600 transform hover:scale-110 transition-all">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-amber-600 transform hover:scale-110 transition-all">
              <Twitter size={20} />
            </a>
          </div>

          <div className="absolute right-0 top-0 opacity-10 w-24 h-24">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="#DB2777" strokeWidth="2" />
              <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="#DB2777" strokeWidth="2" />
              <path d="M40,40 L60,40 L60,60 L40,60 Z" fill="none" stroke="#DB2777" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="py-6 pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-2">CATEGORIES</h3>
            <div className="grid grid-cols-2 gap-y-1">
              {getTopCategories().map((category, index) => (
                <Link key={index} to={`/category/${category.slug}`} className="group text-sm text-gray-700 hover:text-pink-600 transition-colors flex items-center">
                  <span className="w-0 group-hover:w-4 h-px bg-pink-600 mr-0 group-hover:mr-1 transition-all duration-300 ease-in-out"></span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-2">INFORMATION</h3>
            <div className="space-y-1">
              <Link to="/profile" className="group block text-sm text-gray-700 hover:text-pink-600 transition-colors flex items-center">
                <span className="w-0 group-hover:w-4 h-px bg-pink-600 mr-0 group-hover:mr-1 transition-all duration-300 ease-in-out"></span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">My Account</span>
              </Link>
              <Link to="/exchange-return-policy" className="group block text-sm text-gray-700 hover:text-pink-600 transition-colors flex items-center">
                <span className="w-0 group-hover:w-4 h-px bg-pink-600 mr-0 group-hover:mr-1 transition-all duration-300 ease-in-out"></span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">Exchange & Return Policy</span>
              </Link>
              <Link to="/privacy-policy" className="group block text-sm text-gray-700 hover:text-pink-600 transition-colors flex items-center">
                <span className="w-0 group-hover:w-4 h-px bg-pink-600 mr-0 group-hover:mr-1 transition-all duration-300 ease-in-out"></span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">Privacy Policy</span>
              </Link>
              <Link to="/refund-cancellation-policy" className="group block text-sm text-gray-700 hover:text-pink-600 transition-colors flex items-center">
                <span className="w-0 group-hover:w-4 h-px bg-pink-600 mr-0 group-hover:mr-1 transition-all duration-300 ease-in-out"></span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">Refund & Cancellation Policy</span>
              </Link>
              <Link to="/shipping-policy" className="group block text-sm text-gray-700 hover:text-pink-600 transition-colors flex items-center">
                <span className="w-0 group-hover:w-4 h-px bg-pink-600 mr-0 group-hover:mr-1 transition-all duration-300 ease-in-out"></span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">Shipping Policy</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-2">CUSTOMER SERVICE</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Clock className="text-pink-600 mt-0 flex-shrink-0" size={16} />
                <span className="text-sm text-gray-700">MON-FRI - 9:00 AM TO 5:00 PM (IST)</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="text-pink-600 mt-0 flex-shrink-0" size={16} />
                <a href={`tel:${phoneNumber}`} className="group text-sm text-gray-700 hover:text-pink-600 flex items-center">
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">{phoneNumber}</span>
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="text-pink-600 mt-0 flex-shrink-0" size={16} />
                <a href={`mailto:${emailAddress}`} className="group text-sm text-gray-700 hover:text-pink-600 flex items-center">
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">{emailAddress}</span>
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="text-pink-600 mt-0 flex-shrink-0" size={16} />
                <address className="text-sm text-gray-700 not-italic">{address}</address>
              </div>
              <div className="w-full h-40 sm:h-48 md:h-60 my-2 mt-0 border border-gray-300 shadow-lg relative z-10">
                <iframe
                  title="Adaa Jaipur Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.386745076424!2d75.7764873!3d26.8276488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5d69821715b%3A0x90205ef69828a6d5!2sAdaa%20Jaipur!5e0!3m2!1sen!2sin!4v1742331100251!5m2!1sen!2sin"
                  className="w-full h-full border-0 rounded-lg"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-2 pb-2 border-t border-amber-200 relative">
          <p className="text-xs sm:text-sm text-gray-600">Copyright © 2025 ADAA JAIPUR - Celebrating the Heritage of Jaipur</p>
          <div className="absolute left-0 bottom-0 opacity-10">
            <svg width="100" height="30" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,15 C10,5 20,25 30,15 C40,5 50,25 60,15 C70,5 80,25 90,15 C100,5 110,25 120,15" stroke="#DB2777" fill="none" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg width="100" height="30" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,15 C10,5 20,25 30,15 C40,5 50,25 60,15 C70,5 80,25 90,15 C100,5 110,25 120,15" stroke="#DB2777" fill="none" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-600 via-amber-500 to-pink-600" />
    </footer>
  );
};

export default Footer;