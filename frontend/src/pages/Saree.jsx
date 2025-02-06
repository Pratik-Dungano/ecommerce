import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';

const Saree = () => {
  const { products } = useContext(ShopContext);
  const [sortBy, setSortBy] = useState('featured');

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  // Filter products to show only sarees
  const sareeProducts = products.filter(product => 
    product.subcategory?.toLowerCase() === 'sarees'
  );

  // Sort products based on selected option
  const sortedProducts = [...sareeProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0; // Featured - maintain original order
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Sarees Collection</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {sareeProducts.length} {sareeProducts.length === 1 ? 'product' : 'products'} available
          </p>
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

      {sareeProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sarees available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedProducts.map((item, index) => (
            <ProductItem 
            key={index} 
            id={item._id} 
            image={item.image} 
            name={item.name} 
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

export default Saree;