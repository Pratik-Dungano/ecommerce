import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orderData, setOrderData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const validStatuses = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) {
      toast.error("User not authenticated.");
      return null;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const orders = response.data.orders || [];
        // Sort orders by date (most recent first)
        const sortedOrders = orders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrderData(sortedOrders);
        setFilteredOrders(sortedOrders); // Initialize filtered orders
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Filter orders by status
  const filterOrders = (status) => {
    setStatusFilter(status);
    if (status) {
      const filtered = orderData.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orderData); // Reset to all orders if no filter
    }
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
        fetchAllOrders(); // Refresh orders
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold mb-6">Orders</h3>

      {/* Filter by Status */}
      <div className="mb-6">
        <label htmlFor="statusFilter" className="mr-2 font-semibold">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => filterOrders(e.target.value)}
          className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded-md"
        >
          <option value="">All</option>
          {validStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 border rounded-md shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">
                    Order ID: {order._id}
                  </h4>
                  <p className="text-gray-600">
                    Order Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">Total: ₹{order.amount}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">
                    Payment Method: {order.paymentMethod || "Not Provided"}
                  </p>
                  <p className="text-gray-600">
                    Customer Name: {order.address.firstName}{" "}
                    {order.address.lastName}
                  </p>
                  <p className="text-gray-600">
                    Address: {order.address.street}, {order.address.city},{" "}
                    {order.address.state}, {order.address.zipCode},{" "}
                    {order.address.country}
                  </p>
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded-md"
                  >
                    {validStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Items:</h5>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-none"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.productId?.image[0] || "/placeholder.png"} // Access first image
                        alt={item.productId?.name || "Product"}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium">
                          {item.productId?.name || "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p>₹{item.price}</p>
                  </div>
                ))}
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
