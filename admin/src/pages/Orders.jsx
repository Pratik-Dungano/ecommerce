import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
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
        { headers: { token } }
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
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully.");
        fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
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

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="p-4 border rounded-md bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">Order ID: {order._id}</h4>
                  <p className="text-gray-600">Order Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">Total: ₹{order.amount}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Payment Method: {order.paymentMethod || "Not Provided"}</p>
                  <p className="text-gray-600">
                    Customer Name: {order.address.firstName} {order.address.lastName}
                  </p>
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="bg-gray-100 border px-3 py-2 rounded-md"
                  >
                    {validStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
