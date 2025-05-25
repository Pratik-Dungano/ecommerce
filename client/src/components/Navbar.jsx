import React from 'react';
import { Link } from 'react-router-dom';
import NavbarCategories from './NavbarCategories';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            Your Store
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              Home
            </Link>
            
            {/* Categories */}
            <NavbarCategories />
            
            <Link to="/shop-by-category" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              Shop by Category
            </Link>
            
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 