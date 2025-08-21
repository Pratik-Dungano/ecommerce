import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from '../lib/axios';

const Searchbar = () => {
  const { products, showSearch, setShowSearch } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [popularCategories, setPopularCategories] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load popular categories
  useEffect(() => {
    if (products && products.length > 0) {
      // Count category occurrences and get the top 5
      const categoryCounts = products.reduce((acc, product) => {
        if (product.category) {
          acc[product.category] = (acc[product.category] || 0) + 1;
        }
        return acc;
      }, {});
      
      const sorted = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category]) => category);
      
      setPopularCategories(sorted);
    }
  }, [products]);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Close search panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setIsOpen(false);
        setSearchTerm('');
        setSearchResults([]);
      }
    };
    
    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [showSearch]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowSearch(false);
        setIsOpen(false);
        setSearchTerm('');
        setSearchResults([]);
      }
    };

    if (showSearch) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSearch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length >= 2) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(value.toLowerCase()))
      );
      setSearchResults(results.slice(0, 6));
      setIsOpen(true);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      const newRecentSearches = [
        searchTerm,
        ...recentSearches.filter(term => term !== searchTerm)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      
      const results = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      navigate('/collection', { state: { searchTerm, searchResults: results } });
      
      setShowSearch(false);
      setIsOpen(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsOpen(false);
  };

  // Handle recent search click
  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    
    const results = products.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(term.toLowerCase()))
    );
    navigate('/collection', { state: { searchTerm: term, searchResults: results } });
    
    setShowSearch(false);
    setIsOpen(false);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Navigate to category page
  const navigateToCategory = (categoryId) => {
    const category = products.find(product => product.category === categoryId)?.categoryObject;
    if (category && category.slug) {
      setShowSearch(false);
      setIsOpen(false);
      navigate(`/category/${category.slug}`);
    }
  };

  if (!showSearch) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20" 
      ref={searchRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowSearch(false);
          setIsOpen(false);
          setSearchTerm('');
          setSearchResults([]);
        }
      }}
    >
      <div className="w-full max-w-2xl mx-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsOpen(true)}
            className="w-full py-4 pl-12 pr-12 text-lg border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition"
            autoFocus
          />
          <Search className="absolute left-4 text-gray-400" size={24} />
          
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-16 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-4 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition"
          >
            <ArrowRight size={20} />
          </button>
        </form>
        
        {/* Search dropdown */}
        {isOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-500">RECENT SEARCHES</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-pink-600 hover:text-pink-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(term)}
                      className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-gray-200 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search results */}
            {searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-500 p-4 pb-0">
                  PRODUCTS
                </h3>
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    onClick={() => {
                      setIsOpen(false);
                      setShowSearch(false);
                    }}
                    className="flex items-center p-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {product.image && product.image.length > 0 ? (
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-base font-medium text-gray-800 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        ₹{product.price}
                        {product.discountPercentage > 0 && (
                          <span className="ml-2 line-through">
                            ₹{Math.round(product.price / (1 - product.discountPercentage/100))}
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleSearch}
                    className="w-full text-center text-sm text-pink-600 hover:text-pink-700"
                  >
                    See all results ({searchResults.length})
                  </button>
                </div>
              </div>
            ) : searchTerm.length > 0 ? (
              <div className="p-6 text-center">
                <p className="text-base text-gray-500">
                  No results found for "{searchTerm}"
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try checking your spelling or use more general terms
                </p>
              </div>
            ) : (
              // Popular categories when no search term
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">POPULAR CATEGORIES</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {popularCategories.map((categoryId, index) => {
                    const categoryName = products.find(product => product.category === categoryId)?.categoryName;
                    return categoryName ? (
                      <button
                        key={index}
                        onClick={() => navigateToCategory(categoryId)}
                        className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition rounded text-sm text-gray-700"
                      >
                        {categoryName}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;