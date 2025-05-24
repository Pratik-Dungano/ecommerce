import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Searchbar = () => {
  const { products } = useContext(ShopContext);
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
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length >= 2) {
      // Perform search
      const results = products.filter(product => 
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(value.toLowerCase()))
      );
      setSearchResults(results.slice(0, 6)); // Limit to 6 results for UI
      setIsOpen(true);
    } else {
      setSearchResults([]);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Add search term to recent searches
      const newRecentSearches = [
        searchTerm,
        ...recentSearches.filter(term => term !== searchTerm)
      ].slice(0, 5); // Keep only 5 most recent searches
      
      setRecentSearches(newRecentSearches);
      
      // Pass search results via navigation state
      const results = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      setIsOpen(false);
      navigate('/collection', { state: { searchTerm, searchResults: results } });
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  // Handle recent search click
  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    
    // Filter products by term and navigate
    const results = products.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(term.toLowerCase()))
    );
    
    setIsOpen(false);
    navigate('/collection', { state: { searchTerm: term, searchResults: results } });
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
      navigate(`/category/${category.slug}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative z-30 mt-2 mb-4" ref={searchRef}>
      {/* Search form */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition"
        />
        <Search className="absolute left-3 text-gray-400" size={18} />
        
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-12 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-3 bg-pink-500 text-white p-1 rounded-full hover:bg-pink-600 transition"
        >
          <ArrowRight size={16} />
        </button>
      </form>
      
      {/* Search dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-gray-500">RECENT SEARCHES</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-pink-600 hover:text-pink-700"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(term)}
                    className="px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded-full hover:bg-gray-200 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search results */}
          {searchResults.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <h3 className="text-xs font-medium text-gray-500 p-3 pb-0">PRODUCTS</h3>
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center p-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
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
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
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
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleSearch}
                  className="w-full text-center text-sm text-pink-600 hover:text-pink-700"
                >
                  See all results ({products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  ).length})
                </button>
              </div>
            </div>
          ) : searchTerm.length > 0 ? (
            <div className="p-5 text-center">
              <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
              <p className="text-xs text-gray-400 mt-1">Try checking your spelling or use more general terms</p>
            </div>
          ) : (
            // Popular categories when no search term
            <div className="p-3">
              <h3 className="text-xs font-medium text-gray-500 mb-2">POPULAR CATEGORIES</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {popularCategories.map((categoryId, index) => {
                  const categoryName = products.find(product => product.category === categoryId)?.categoryName;
                  return categoryName ? (
                    <button
                      key={index}
                      onClick={() => navigateToCategory(categoryId)}
                      className="text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 transition rounded text-sm text-gray-700"
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
  );
};

export default Searchbar;