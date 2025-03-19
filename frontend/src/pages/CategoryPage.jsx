import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import { FaLeaf, FaStar } from "react-icons/fa";

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const { products, categories, getCategories } = useContext(ShopContext);
  const [sortBy, setSortBy] = useState('featured');
  const [showEcoFriendly, setShowEcoFriendly] = useState(false);
  const [showBestSeller, setShowBestSeller] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch categories if not available
    if (!categories || categories.length === 0) {
      getCategories();
    }
  }, [categories, getCategories]);

  useEffect(() => {
    // Find the current category and subcategory based on URL parameters
    if (categories.length > 0 && categorySlug) {
      const category = categories.find(
        cat => cat.slug.toLowerCase() === categorySlug.toLowerCase()
      );
      
      if (category) {
        setCurrentCategory(category);
        
        if (subcategorySlug && category.subcategories) {
          const subcategory = category.subcategories.find(
            subcat => subcat.slug.toLowerCase() === subcategorySlug.toLowerCase()
          );
          
          if (subcategory) {
            setCurrentSubcategory(subcategory);
          } else {
            setCurrentSubcategory(null);
          }
        } else {
          setCurrentSubcategory(null);
        }
      } else {
        setCurrentCategory(null);
        setCurrentSubcategory(null);
      }
    }
  }, [categorySlug, subcategorySlug, categories]);

  // Filter products based on category and subcategory
  let filteredProducts = products;

  if (currentCategory) {
    if (currentSubcategory) {
      // If a subcategory is selected, filter by that subcategory
      filteredProducts = products.filter(product => 
        product.subcategory?.toLowerCase() === currentSubcategory.name.toLowerCase() ||
        product.subcategoryId === currentSubcategory._id
      );
    } else {
      // If just a category is selected, show all products in that category
      const subcategoryNames = currentCategory.subcategories.map(sc => sc.name.toLowerCase());
      filteredProducts = products.filter(product => 
        subcategoryNames.includes(product.subcategory?.toLowerCase()) ||
        currentCategory.subcategories.some(sc => sc._id === product.subcategoryId) ||
        product.category?.toLowerCase() === currentCategory.name.toLowerCase() ||
        product.categoryId === currentCategory._id
      );
    }
  }

  // Apply additional filters
  if (showEcoFriendly) {
    filteredProducts = filteredProducts.filter(product => product.ecoFriendly);
  }

  if (showBestSeller) {
    filteredProducts = filteredProducts.filter(product => product.bestseller);
  }

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Generate title based on current category and subcategory
  const pageTitle = currentSubcategory 
    ? `${currentSubcategory.name} Collection` 
    : currentCategory 
      ? `${currentCategory.name} Collection` 
      : 'Products';
      
  // Show simple placeholder while categories are loading
  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">{pageTitle}</h1>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </p>
            <div className="flex items-center gap-3">
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              sizes={item.sizes}
              discountPercentage={item.discountPercentage}
              ecoFriendly={item.ecoFriendly}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
