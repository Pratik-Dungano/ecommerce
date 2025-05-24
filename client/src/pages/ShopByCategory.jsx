import React, { useState, useEffect } from 'react';
import { getShopCategories } from '../../admin/src/services/categoryService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getShopCategories();
      if (response.success) {
        setCategories(response.categories);
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      setError('Failed to fetch categories. Please try again.');
      toast.error('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={fetchCategories}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No categories available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {category.image && (
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h2>
                
                {category.description && (
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                )}
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Subcategories:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory._id}
                          to={`/products?category=${category._id}&subcategory=${subcategory._id}`}
                          className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <Link
                  to={`/products?category=${category._id}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  View Products
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopByCategory; 