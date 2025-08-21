import React, { useState, useContext } from 'react';
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Menu, X, ShoppingCart, Heart, User, Search } from 'lucide-react'; // Added Search icon

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDesktopSearchBar, setShowDesktopSearchBar] = useState(false); // Desktop search bar state
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);   // Mobile search bar state
  const { categories, getCartCount, getWishListCount } = useContext(ShopContext);

  // Get featured categories (up to 5)
  const featuredCategories = categories
    ?.filter(category => category.featured)
    .slice(0, 5) || [];

  // Default categories if none are featured
  const defaultCategories = [
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Kurtas', slug: 'kurtas' },
    { name: 'Sarees', slug: 'sarees' },
    { name: 'Gowns', slug: 'gowns' },
    { name: 'Lehengas', slug: 'lehengas' }
  ];

  const displayCategories = featuredCategories.length > 0 ? featuredCategories : defaultCategories;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" role="navigation">
    <nav className="bg-white shadow-md sticky top-0 z-50" role="navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-serif font-bold text-pink-600 hover:text-amber-600 transition-colors duration-200"
            onClick={scrollToTop}
          >
            ADAA JAIPUR
          <Link 
            to="/" 
            className="text-2xl font-serif font-bold text-pink-600 hover:text-amber-600 transition-colors duration-200"
            onClick={scrollToTop}
          >
            ADAA JAIPUR
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
              onClick={scrollToTop}
            >
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
              onClick={scrollToTop}
            >
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-pink-600 transition-colors duration-200 flex items-center">
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {displayCategories.map((category) => (
                  <Link
                    key={category.slug || category._id}
                    to={`/category/${category.slug || category._id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200"
                    onClick={scrollToTop}
                    aria-label={`View ${category.name} category`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Icon & Bar (Desktop) */}
            <div className="relative flex items-center">
              <button
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                onClick={() => setShowDesktopSearchBar(prev => !prev)}
                aria-label="Toggle search"
                type="button"
              >
                <Search className="w-6 h-6" />
              </button>
              {showDesktopSearchBar && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 px-2 py-1 border rounded focus:outline-none focus:ring focus:border-pink-400 transition-all duration-200"
                  autoFocus
                />
              )}
            </div>

            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-pink-600 transition-colors duration-200 relative"
              onClick={scrollToTop}
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <Link 
              to="/wishlist" 
              className="text-gray-700 hover:text-pink-600 transition-colors duration-200 relative"
              onClick={scrollToTop}
            >
              <Heart className="w-6 h-6" />
              {getWishListCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getWishListCount()}
                </span>
              )}
            </Link>

            <Link 
              to="/account" 
              className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
              onClick={scrollToTop}
            >
              <User className="w-6 h-6" />

            <Link 
              to="/account" 
              className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
              onClick={scrollToTop}
            >
              <User className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-pink-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-pink-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Link>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <div className="font-medium text-gray-700">Categories</div>
                {displayCategories.map((category) => (
                  <Link
                    key={category.slug || category._id}
                    to={`/category/${category.slug || category._id}`}
                    className="block pl-4 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                    }}
                    aria-label={`View ${category.name} category`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Search Icon & Bar (Mobile) */}
              <div className="relative flex items-center">
                <button
                  className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                  onClick={() => setShowMobileSearchBar(prev => !prev)}
                  aria-label="Toggle search"
                  type="button"
                >
                  <Search className="w-6 h-6" />
                </button>
                {showMobileSearchBar && (
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 px-2 py-1 border rounded focus:outline-none focus:ring focus:border-pink-400 transition-all duration-200"
                    autoFocus
                  />
                )}
              </div>

              <Link 
                to="/cart" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200 flex items-center"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Cart
                {getCartCount() > 0 && (
                  <span className="ml-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <Link 
                to="/wishlist" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200 flex items-center"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                <Heart className="w-6 h-6 mr-2" />
                Wishlist
                {getWishListCount() > 0 && (
                  <span className="ml-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishListCount()}
                  </span>
                )}
              </Link>

              <Link 
                to="/account" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200 flex items-center"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                <User className="w-6 h-6 mr-2" />
                Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;