import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="border-t pt-16 mx-10">
      <div className="text-2xl">
        <Title text1="MY " text2="ORDERS" />
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-8">Loading orders...</p>
      )}
      {!loading && (
        <div>
          {orderData.length > 0 ? (
            orderData.map((order, index) => (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-500">
                    Order Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500">
                    Order Total: {currency}
                    {order.amount}
                  </p>
                </div>
                {order.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start gap-6 text-sm border-b pb-4"
                  >
                    <img
                      className="w-16 sm:w-20"
                      src={item.productId?.image[0] || "/placeholder.png"} // Access first image
                      alt={item.productId?.name || "Product"}
                    />
                    <div>
                      <p className="sm:text-base font-medium">
                        {item.productId?.name || "Unknown Product"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {currency}
                          {item.price}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`min-w-2 h-2 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-500"
                          : order.status === "Shipped"
                          ? "bg-blue-500"
                          : order.status === "Cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>
                  <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                    Track Order
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">
              You have no orders yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
