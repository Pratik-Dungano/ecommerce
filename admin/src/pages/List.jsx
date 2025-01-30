import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const List = ({token}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      setList(response.data.products); // Assuming backend returns products in `products` key
      setLoading(false);
    } catch (error) {
      toast.error(response.data.message)
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
        toast.success('Product removed successfully!');
        await fetchList(); // Refresh list after removing
      } else {
        toast.error(response.data.message || 'Failed to remove product.');
      }
    } catch (error) {
      console.error('Error:', error); // Log the error
      toast.error(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products List</h2>
      <table className="w-full text-left bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-gray-700 font-medium">Image</th>
            <th className="px-4 py-3 text-gray-700 font-medium">Name</th>
            <th className="px-4 py-3 text-gray-700 font-medium">Category</th>
            <th className="px-4 py-3 text-gray-700 font-medium">Price</th>
            <th className="px-4 py-3 text-gray-700 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((product) => (
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
              <td className="px-4 py-3 text-gray-800 font-semibold">₹{product.price}</td>
              <td className="px-4 py-3 text-center">
                <button
                  className="text-black font-bold text-lg hover:text-gray-600 transition duration-200"
                  onClick={() =>removeProduct(product._id)} // Placeholder action
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
