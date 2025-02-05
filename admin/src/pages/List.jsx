import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
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
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Product removed successfully!");
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove product.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filtering logic
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products List</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-5">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border rounded w-60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {[...new Set(list.map((product) => product.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
        >
          <option value="">All Subcategories</option>
          {[...new Set(list.map((product) => product.subcategory))].map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <table className="w-full text-left bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-gray-700 font-medium">Image</th>
            <th className="px-4 py-3 text-gray-700 font-medium">Name</th>
            <th className="px-4 py-3 text-gray-700 font-medium">Category</th>
            <th className="px-4 py-3 text-gray-700 font-medium">Subcategory</th>
            <th className="px-4 py-3 text-gray-700 font-medium">Price</th>
            <th className="px-4 py-3 text-gray-700 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.subcategory || "N/A"}</td>
                <td className="px-4 py-3 text-gray-800 font-semibold">₹{product.price}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/edit/${product._id}`}
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800 transition duration-200"
                      onClick={() => removeProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-5 text-gray-600">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
