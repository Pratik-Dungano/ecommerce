import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { FaLeaf, FaStar } from "react-icons/fa";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Collection = () => {
  const location = useLocation();
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('relevant');
  const [showEcoFriendly, setShowEcoFriendly] = useState(false);
  const [showBestSeller, setShowBestSeller] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category/list`);
        
        // Fix: Check the response structure and access the categories array correctly
        const categoriesData = response.data.categories || response.data;
        
        // Make sure we're working with an array before calling filter
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData.filter(cat => cat.active));
        } else {
          console.error('Expected categories array but got:', categoriesData);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Handle search term from URL state when component mounts
  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchKeyword(location.state.searchTerm);
      
      // Try to match the search term to categories and subcategories
      if (categories.length > 0) {
        matchSearchToCategories(location.state.searchTerm);
      }
    }
  }, [location.state, categories]);
  
  // Function to match search keywords to categories and subcategories
  const matchSearchToCategories = (term) => {
    const lowercaseTerm = term.toLowerCase();
    const matchedCategories = [];
    const matchedSubcategories = [];
    
    categories.forEach(category => {
      // Check if category name matches
      if (category.name.toLowerCase().includes(lowercaseTerm)) {
        matchedCategories.push(category._id);
      }
      
      // Check subcategories
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(subcategory => {
          if (subcategory.active && subcategory.name.toLowerCase().includes(lowercaseTerm)) {
            matchedSubcategories.push(subcategory._id);
            if (!matchedCategories.includes(category._id)) {
              matchedCategories.push(category._id);
            }
          }
        });
      }
    });
    
    if (matchedCategories.length > 0) {
      setSelectedCategories(matchedCategories);
    }
    
    if (matchedSubcategories.length > 0) {
      setSelectedSubcategories(matchedSubcategories);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    let result = [...products];
    
    console.log('Initial products count:', products.length);

    // Filter by search keyword if provided
    if (searchKeyword) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      console.log('After keyword filter, products count:', result.length);
    }
    // Otherwise use global search if active
    else if (showSearch && search) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by selected categories using categoryId - convert IDs to strings for comparison
    if (selectedCategories.length > 0) {
      const categoryIds = selectedCategories.map(id => id.toString());
      result = result.filter(product => {
        const productCategoryId = String(product.categoryId || '');
        return categoryIds.includes(productCategoryId);
      });
      
      console.log('Category IDs to filter by:', categoryIds);
      console.log('After category filter, products count:', result.length);
      
      // Sample product for debugging
      if (result.length === 0 && products.length > 0) {
        const sample = products[0];
        console.log('Sample product category data:', {
          name: sample.name,
          categoryId: sample.categoryId,
          categoryIdType: typeof sample.categoryId,
          categoryIdString: String(sample.categoryId || '')
        });
      }
    }

    // Filter by selected subcategories using subcategoryId - convert IDs to strings
    if (selectedSubcategories.length > 0) {
      const subcategoryIds = selectedSubcategories.map(id => id.toString());
      result = result.filter(product => {
        const productSubcategoryId = String(product.subcategoryId || '');
        return subcategoryIds.includes(productSubcategoryId);
      });
      
      console.log('Subcategory IDs to filter by:', subcategoryIds);
      console.log('After subcategory filter, products count:', result.length);
    }

    if (showEcoFriendly) {
      result = result.filter((product) => product.ecoFriendly);
    }

    if (showBestSeller) {
      result = result.filter((product) => product.bestseller);
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    switch (sortBy) {
      case 'low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    console.log('Final filtered products count:', result.length);
    setFilteredProducts(result);
  }, [products, search, showSearch, searchKeyword, selectedCategories, selectedSubcategories, priceRange, sortBy, showEcoFriendly, showBestSeller]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
    
    // If a category is being unchecked, also remove its subcategories
    if (selectedCategories.includes(value)) {
      const categoryObj = categories.find(cat => cat._id === value);
      if (categoryObj && categoryObj.subcategories) {
        const subcategoryIds = categoryObj.subcategories.map(sub => sub._id);
        setSelectedSubcategories(prev => 
          prev.filter(id => !subcategoryIds.includes(id))
        );
      }
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Clear current search
  const clearSearch = () => {
    setSearchKeyword('');
    setSelectedCategories([]);
    setSelectedSubcategories([]);
  };
  
  // Get page title based on search state
  const getPageTitle = () => {
    if (searchKeyword) {
      return {
        text1: "SEARCH RESULTS FOR",
        text2: ` "${searchKeyword}"`
      };
    }
    
    if (selectedCategories.length === 1) {
      const category = categories.find(cat => cat._id === selectedCategories[0]);
      return {
        text1: category?.name?.toUpperCase() || "COLLECTION",
        text2: ""
      };
    }
    
    return { text1: "ALL", text2: " COLLECTIONS" };
  };
  
  const pageTitle = getPageTitle();

  return (
    <div className="flex flex-col sm:flex-row pt-10 border-t">
      <div className="sm:w-1/3 p-4 border-r border-gray-300">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowFilter(!showFilter)}
        >
          <p className="my-2 text-xl">FILTERS</p>
          <img
            className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </div>

        <div className={`${showFilter ? '' : 'hidden'} sm:block space-y-5`}>
          {searchKeyword && (
            <div className="border border-gray-300 p-5">
              <div className="flex justify-between items-center">
                <p className="mb-3 text-sm font-medium">SEARCH TERM</p>
                <button 
                  onClick={clearSearch}
                  className="text-xs text-pink-600 hover:text-pink-800"
                >
                  Clear
                </button>
              </div>
              <div className="px-3 py-2 bg-pink-50 text-pink-800 text-sm rounded">
                {searchKeyword}
              </div>
            </div>
          )}

          <div className="border border-gray-300 p-5">
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                categories.map(category => (
                  <div key={category._id} className="space-y-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category._id}`}
                        value={category._id}
                        checked={selectedCategories.includes(category._id)}
                        onChange={handleCategoryChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`category-${category._id}`} className="ml-2 text-sm">
                        {category.name}
                      </label>
                    </div>
                    
                    {/* Subcategories */}
                    {selectedCategories.includes(category._id) && category.subcategories && (
                      <div className="ml-6 space-y-1 mt-1">
                        {category.subcategories
                          .filter(sub => sub.active)
                          .map(subcategory => (
                            <div key={subcategory._id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`subcategory-${subcategory._id}`}
                                value={subcategory._id}
                                checked={selectedSubcategories.includes(subcategory._id)}
                                onChange={handleTypeChange}
                                className="w-3 h-3"
                              />
                              <label htmlFor={`subcategory-${subcategory._id}`} className="ml-2 text-xs text-gray-600">
                                {subcategory.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border border-gray-300 p-5">
            <p className="mb-3 text-sm font-medium">FEATURES</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showEcoFriendly}
                  onChange={(e) => setShowEcoFriendly(e.target.checked)}
                  className="w-4 h-4"
                />
                <div className="flex items-center gap-1">
                  <FaLeaf className="text-green-600" size={14} />
                  <span>Eco-Friendly</span>
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showBestSeller}
                  onChange={(e) => setShowBestSeller(e.target.checked)}
                  className="w-4 h-4"
                />
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" size={14} />
                  <span>Best Seller</span>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-gray-300 p-5">
            <p className="mb-3 text-sm font-medium">PRICE RANGE</p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))
                  }
                  placeholder="Min"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                  }
                  placeholder="Max"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:w-2/3 p-4">
        <div className="flex justify-between items-center mb-6">
          <Title text1={pageTitle.text1} text2={pageTitle.text2} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-2 border-gray-300 text-sm p-2 rounded"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Price Low to High</option>
            <option value="high-low">Sort by: Price High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filteredProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              sizes={item.sizes}
              discountPercentage={item.discountPercentage}
              ecoFriendly={item.ecoFriendly}
              bestseller={item.bestseller}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No products match your filter criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
