import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      setList(response.data.products);
      setFilteredProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!id) {
      toast.error("Invalid product ID");
      return;
    }

    try {
      const loadingToast = toast.loading("Removing product...");

      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      toast.dismiss(loadingToast);

      if (response.data.success) {
        toast.success("Product removed successfully!");
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to remove product. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    let filtered = list;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedSubcategory) {
      filtered = filtered.filter((product) => product.subcategory === selectedSubcategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedSubcategory, list]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Products List</h2>
          <Link to="/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full p-2 border rounded-lg pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-2.5 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            className="w-full p-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(list.map((product) => product.category))].map((category, index) => (
              <option key={`category-${index}-${category}`} value={category}>{category}</option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">All Subcategories</option>
            {[...new Set(list.map((product) => product.subcategory))].map((subcategory, index) => (
              <option key={`subcategory-${index}-${subcategory}`} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative pb-[100%]">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {product.ecoFriendly && (
                  <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Eco-Friendly
                  </span>
                )}
                {product.bestseller && (
                  <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Bestseller
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-gray-600">
                    <span className="font-medium">₹{product.price}</span>
                    {product.discountPercentage > 0 && (
                      <span className="ml-2 text-sm text-green-600">-{product.discountPercentage}%</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.sizes.map((size) => (
                    <span key={size} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {size}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between gap-2">
                  <Link
                    to={`/edit/${product._id}`}
                    className="flex-1 bg-blue-100 text-blue-600 text-center py-2 rounded hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove this product?')) {
                        removeProduct(product._id);
                      }
                    }}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
