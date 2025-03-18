import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const RecentlyAdded = () => {
  const { products } = useContext(ShopContext);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Sort products by createdAt in descending order (newest first)
      const sortedProducts = [...products].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      // Get the 4 most recently added products
      const recent = sortedProducts.slice(0, 4);
      setRecentProducts(recent);
    }
  }, [products]);

  if (!recentProducts || recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Just Arrived</h2>
          <p className="text-lg text-gray-600 mt-2">
            Our newest additions to help you stay ahead of the trends
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recentProducts.map((item) => (
            <ProductItem 
              key={item._id} 
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price} 
              sizes={item.sizes}
              discountPercentage={item.discountPercentage}
              ecoFriendly={item.ecoFriendly}
              isNew={true} // Add a new flag to show "New" badge
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyAdded; 