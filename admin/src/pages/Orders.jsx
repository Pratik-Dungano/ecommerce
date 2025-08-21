import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orderData, setOrderData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const validStatuses = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const paymentMethods = ["COD", "Stripe"];

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const orders = response.data.orders || [];
        // Sort by most recent date
        const sortedOrders = orders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrderData(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...orderData];

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter(
        (order) => order.paymentMethod === paymentFilter
      );
    }

    if (customerSearch.trim()) {
      filtered = filtered.filter((order) =>
        `${order.address.firstName} ${order.address.lastName}`
          .toLowerCase()
          .includes(customerSearch.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.date) <= new Date(endDate)
      );
    }

    setFilteredOrders(filtered);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully.");
        fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.data?.message === "Cannot modify an order cancelled by user") {
        toast.error("Cannot modify an order that was cancelled by the user");
      } else {
        toast.error("Failed to update order status.");
      }
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, paymentFilter, customerSearch, startDate, endDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold mb-6">Orders</h3>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="statusFilter" className="block font-semibold mb-1">
            Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-100 border px-3 py-2 rounded-md"
          >
            <option value="">All</option>
            {validStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label htmlFor="paymentFilter" className="block font-semibold mb-1">
            Payment Method:
          </label>
          <select
            id="paymentFilter"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-gray-100 border px-3 py-2 rounded-md"
          >
            <option value="">All</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Search */}
        <div>
          <label htmlFor="customerSearch" className="block font-semibold mb-1">
            Customer Name:
          </label>
          <input
            id="customerSearch"
            type="text"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Search by name"
            className="bg-gray-100 border px-3 py-2 rounded-md"
          />
        </div>

        {/* Date Range Filters */}
        <div>
          <label className="block font-semibold mb-1">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-100 border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-100 border px-3 py-2 rounded-md"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer & Shipping</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">#{order._id.slice(-8)}</p>
                    <p className="text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    <p className="text-gray-500">₹{order.amount.toFixed(2)}</p>
                    <p className={`mt-1 inline-flex px-2 py-1 rounded text-xs font-semibold ${
                      order.paymentMethod === "COD" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}>
                      {order.paymentMethod}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3">
                        {item.productId ? (
                          <>
                            <img
                              src={item.productId.image[0]}
                              alt={item.productId.name}
                              className="w-16 h-16 object-cover rounded-md border border-gray-200"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.productId.name}</p>
                              <p className="text-sm text-gray-500">
                                Size: {item.size} | Qty: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-900">Product Unavailable</p>
                            <p className="text-sm text-gray-500">
                              Size: {item.size} | Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="text-gray-500">{order.address.email}</p>
                    <div className="mt-1 text-gray-500">
                      <p className="whitespace-pre-wrap">{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                      <p>{order.address.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {order.cancelledBy === "user" ? (
                    <div className="w-full px-3 py-2 text-sm rounded-md bg-red-50 text-red-700 border border-red-200">
                      Cancelled by User
                    </div>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={order.cancelledBy === "user"}
                      className={`w-full px-3 py-2 text-sm rounded-md border ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.status === "Cancelled"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      } ${order.cancelledBy === "user" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {validStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
