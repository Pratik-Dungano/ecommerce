import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getShopCategories } from '../services/categoryService';
import { Spinner } from './Spinner';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState({ featured: [], regular: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getShopCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  const renderCategoryCard = (category) => (
    <Link
      key={category._id}
      to={`/products?category=${category._id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.image || '/placeholder-category.jpg'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{category.description}</p>
        )}
        <div className="flex items-center text-sm text-gray-500">
          <span>{category.subcategories?.length || 0} subcategories</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Categories Section */}
      {categories.featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.featured.map(renderCategoryCard)}
          </div>
        </div>
      )}

      {/* Regular Categories Section */}
      {categories.regular.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.regular.map(renderCategoryCard)}
          </div>
        </div>
      )}

      {/* No Categories Message */}
      {categories.featured.length === 0 && categories.regular.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No categories available at the moment.
        </div>
      )}
    </div>
  );
};

export default FeaturedCategories; 