import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FaChevronDown } from 'react-icons/fa';

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { categories, getCategories } = useContext(ShopContext);

  useEffect(() => {
    // Only fetch categories if they haven't been loaded yet
    if (!categories || categories.length === 0) {
      getCategories();
    }
  }, [categories, getCategories]);

  const handleCategoryMouseEnter = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCategoryMouseLeave = () => {
    setActiveCategory(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to get URLs using category slug
  const getCategoryUrl = (slug) => {
    return `/category/${slug}`;
  };

  // Function to get URLs using category and subcategory slugs
  const getSubcategoryUrl = (categorySlug, subcategorySlug) => {
    return `/category/${categorySlug}/${subcategorySlug}`;
  };

  // Don't show loading indicator, just return empty nav if categories aren't loaded yet
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-12"></div>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-white border-t border-b border-gray-200">
      {/* Desktop Category Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="hidden md:flex justify-center">
          <ul className="flex space-x-8">
            {categories.filter(cat => cat.active).map((category) => (
              <li 
                key={category._id} 
                className="relative group"
                onMouseEnter={() => handleCategoryMouseEnter(category._id)}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <Link
                  to={getCategoryUrl(category.slug)}
                  className="flex items-center py-3 text-gray-700 hover:text-black transition duration-150 ease-in-out font-medium"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {category.name}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <FaChevronDown className="ml-1 h-3 w-3" />
                  )}
                </Link>
                
                {/* Subcategories dropdown */}
                {category.subcategories && category.subcategories.length > 0 && activeCategory === category._id && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                    {category.subcategories
                      .filter(subcat => subcat.active)
                      .map((subcategory) => (
                        <Link
                          key={subcategory._id}
                          to={getSubcategoryUrl(category.slug, subcategory.slug)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition duration-150 ease-in-out"
                          onClick={() => {
                            setActiveCategory(null);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Category Navigation */}
        <div className="md:hidden py-2">
          <button
            onClick={toggleMobileMenu}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-700 bg-gray-50 rounded-md"
          >
            <span className="font-medium">Categories</span>
            <FaChevronDown className={`h-4 w-4 transition-transform ${isMobileMenuOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isMobileMenuOpen && (
            <div className="mt-2 space-y-1 bg-white rounded-md shadow-md border border-gray-200">
              {categories.filter(cat => cat.active).map((category) => (
                <div key={category._id} className="border-b border-gray-100 last:border-b-0">
                  <Link
                    to={getCategoryUrl(category.slug)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {category.name}
                  </Link>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="pl-6 pb-2">
                      {category.subcategories
                        .filter(subcat => subcat.active)
                        .map((subcategory) => (
                          <Link
                            key={subcategory._id}
                            to={getSubcategoryUrl(category.slug, subcategory.slug)}
                            className="block px-4 py-1 text-sm text-gray-600 hover:bg-gray-50 hover:text-black"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              window.scrollTo(0, 0);
                            }}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
