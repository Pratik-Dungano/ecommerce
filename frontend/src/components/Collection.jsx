import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { FaLeaf, FaStar } from "react-icons/fa";
import axios from 'axios';

const Collection = () => {
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
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category/list`);
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    let result = [...products];

    if (showSearch && search) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    if (selectedSubcategories.length > 0) {
      result = result.filter((product) =>
        selectedSubcategories.includes(product.subcategoryId)
      );
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

    setFilteredProducts(result);
  }, [products, search, showSearch, selectedCategories, selectedSubcategories, priceRange, sortBy, showEcoFriendly, showBestSeller]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
    
    // Reset subcategories when a category is unchecked
    if (prev.includes(value)) {
      const category = categories.find(cat => cat._id === value);
      if (category) {
        const subcategoryIds = category.subcategories.map(sub => sub._id);
        setSelectedSubcategories(prev => prev.filter(id => !subcategoryIds.includes(id)));
      }
    }
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Get all available subcategories for the selected categories
  const getAvailableSubcategories = () => {
    if (selectedCategories.length === 0) {
      return categories.flatMap(cat => cat.subcategories);
    }
    
    return categories
      .filter(cat => selectedCategories.includes(cat._id))
      .flatMap(cat => cat.subcategories);
  };

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
          <div className="border border-gray-300 p-5">
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                categories.map((category) => (
                  <label key={category._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      value={category._id}
                      checked={selectedCategories.includes(category._id)}
                      onChange={handleCategoryChange}
                      className="w-4 h-4"
                    />
                    {category.name}
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="border border-gray-300 p-5">
            <p className="mb-3 text-sm font-medium">SUBCATEGORIES</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-500">Loading subcategories...</p>
              ) : (
                getAvailableSubcategories().map((subcategory) => (
                  <label key={subcategory._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      value={subcategory._id}
                      checked={selectedSubcategories.includes(subcategory._id)}
                      onChange={handleSubcategoryChange}
                      className="w-4 h-4"
                    />
                    {subcategory.name}
                  </label>
                ))
              )}
              {!loading && getAvailableSubcategories().length === 0 && (
                <p className="text-sm text-gray-500">
                  {selectedCategories.length > 0 
                    ? 'No subcategories available for selected categories' 
                    : 'Select a category to see subcategories'}
                </p>
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
          <Title text1="ALL" text2=" COLLECTIONS" />
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
              video={item.video}
              isNew={item.isNew}
              quantity={item.quantity}
              isOutOfStock={item.isOutOfStock}
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