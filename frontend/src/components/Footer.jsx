import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Logo and Description */}
          <div>
            {/* Replace the text below with your logo */}
            <div className="text-2xl font-bold text-gray-800 mb-4">
              <img src={assets.logo} alt="Forever Logo" className="h-8" /> {/* Adjust height */}
            </div>
            <p className="text-gray-600">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book.
            </p>
          </div>

          {/* Center Section - Company Links */}
          <div className="flex justify-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">COMPANY</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-600 hover:text-gray-800">Home</a></li>
                <li><a href="#about" className="text-gray-600 hover:text-gray-800">About us</a></li>
                <li><a href="#delivery" className="text-gray-600 hover:text-gray-800">Delivery</a></li>
                <li><a href="#privacy-policy" className="text-gray-600 hover:text-gray-800">Privacy policy</a></li>
              </ul>
            </div>
          </div>

          {/* Right Section - Get in Touch */}
          <div className="flex justify-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">GET IN TOUCH</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">+1-000-000-0000</li>
                <li className="text-gray-600">suraj@gmail.com</li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-600">
            Copyright © 2024@ suraj.dev - All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
