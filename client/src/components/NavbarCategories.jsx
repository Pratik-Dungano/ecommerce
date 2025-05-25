import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNavbarCategories } from '../../admin/src/services/categoryService';

const NavbarCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getNavbarCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Failed to fetch navbar categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex space-x-4">
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/products?category=${category._id}`}
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default NavbarCategories; 