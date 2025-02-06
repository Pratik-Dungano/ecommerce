import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ReviewForm from "../components/ReviewForm";
import { toast } from "react-toastify";

const TrackingModal = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const getStatusSteps = () => {
    const steps = [
      { status: "Processing", date: "Order Placed" },
      { status: "Shipped", date: "Order Shipped" },
      { status: "Out for Delivery", date: "Out for Delivery" },
      { status: "Delivered", date: "Delivered" }
    ];

    const currentIndex = steps.findIndex(step => step.status === order.status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Order Status</h2>
          
          <div className="space-y-8">
            {/* Status Banner */}
            <div className={`p-4 rounded-lg ${
              order.status === "Delivered" ? "bg-green-50" :
              order.status === "Shipped" ? "bg-blue-50" :
              order.status === "Cancelled" ? "bg-red-50" :
              "bg-yellow-50"
            }`}>
              <h3 className={`font-semibold ${
                order.status === "Delivered" ? "text-green-700" :
                order.status === "Shipped" ? "text-blue-700" :
                order.status === "Cancelled" ? "text-red-700" :
                "text-yellow-700"
              }`}>
                {order.status}
              </h3>
              <p className="text-gray-600 mt-1">
                {order.status === "Processing" && "Your order is being prepared"}
                {order.status === "Shipped" && "Your order is on its way"}
                {order.status === "Out for Delivery" && "Your order will be delivered today"}
                {order.status === "Delivered" && "Your order has been delivered"}
                {order.status === "Cancelled" && "This order was cancelled"}
              </p>
            </div>

            {/* Timeline */}
            {order.status !== "Cancelled" && (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {getStatusSteps().map((step, index) => (
                  <div key={index} className="relative flex items-center mb-8 last:mb-0">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 
                      ${step.completed ? 
                        'bg-blue-500 border-blue-500' : 
                        'bg-white border-gray-300'
                      }`}
                    >
                      {step.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className={`font-medium ${step.completed ? 'text-blue-500' : 'text-gray-500'}`}>
                        {step.status}
                      </p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Order Details */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Order Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium">
                    {order.amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { token, backendUrl, currency, userId } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  // Add animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      if (!token) return;
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const sortedOrders = (response.data.orders || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrderData(sortedOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReviewClick = (order, item) => {
    setReviewItem({
      orderId: order._id,
      productId: item.productId._id,
      productName: item.productId.name,
      productImage: item.productId.image[0]
    });
  };

  const handleReviewSubmitted = (productId) => {
    // Update the reviewedProducts set
    setReviewedProducts(prev => {
      const newSet = new Set(prev);
      newSet.add(productId);
      return newSet;
    });
    setReviewItem(null);
    toast.success("Thank you for reviewing the product!");
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        loadOrders(); // Reload orders to reflect the change
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="border-t pt-16 mx-4 md:mx-10">
      <div className="text-2xl mb-8">
        <Title text1="MY " text2="ORDERS" />
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && orderData.length > 0 && (
        <div className="space-y-8">
          {orderData.map((order) => (
            <div key={order._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-6 space-y-6">
                {/* Order header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="text-sm bg-black text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Track Order
                    </button>
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    <p className={`text-sm font-medium ${
                      order.status === "Delivered" ? "text-green-600" :
                      order.status === "Cancelled" ? "text-red-600" :
                      "text-blue-600"
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-6">
                  {order.items.map((item) => (
                    item.productId && (
                      <div key={item._id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img
                            src={item.productId?.image?.[0] || '/placeholder.jpg'}
                            alt={item.productId?.name || 'Product'}
                            className="w-full h-full object-cover object-center rounded-md"
                          />
                        </div>
                        <div className="flex-grow space-y-1">
                          <h3 className="font-medium">{item.productId?.name}</h3>
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
           
                          
                          {/* Show review button only if not reviewed and order is delivered */}
                          {order.status === "Delivered" && 
                           item.productId && 
                           !reviewedProducts.has(item.productId._id) && (
                            <button
                              onClick={() => handleReviewClick(order, item)}
                              className="mt-2 text-sm bg-black text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                            >
                              Write a Review
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Order total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total Amount:</p>
                    <p className="font-bold text-lg">{currency}{order.amount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && orderData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
        </div>
      )}

      {selectedOrder && (
        <TrackingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
        />
      )}

      {/* Review Form Modal */}
      {reviewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 animate-fadeIn">
            <button 
              onClick={() => setReviewItem(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            
            <h2 className="text-xl font-bold mb-4">Write a Review</h2>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={reviewItem.productImage}
                alt={reviewItem.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{reviewItem.productName}</h3>
              </div>
            </div>
            
            <ReviewForm
              productId={reviewItem.productId}
              orderId={reviewItem.orderId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;