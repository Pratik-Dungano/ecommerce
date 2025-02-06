import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import { FaLeaf, FaStar } from "react-icons/fa";

const Kurtas = () => {
  const { products } = useContext(ShopContext);
  const [sortBy, setSortBy] = useState('featured');
  const [showEcoFriendly, setShowEcoFriendly] = useState(false);
  const [showBestSeller, setShowBestSeller] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter products to show only kurtas with additional filters
  let filteredProducts = products.filter(product => 
    product.subcategory?.toLowerCase() === 'kurtas'
  );

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Kurtas Collection</h1>
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
    </div>
  );
};

export default Kurtas;