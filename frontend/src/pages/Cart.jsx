import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateCart, navigate, getCart } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    const tempData = cartItems.map((item) => ({
      _id: item.itemId,
      size: item.size,
      quantity: item.quantity,
    }));
    setCartData(tempData);
  }, [cartItems]);

  const handleQuantityChange = (itemId, size, quantity) => {
    if (quantity === "" || quantity === 0) {
      return;
    }
    updateCart(itemId, size, quantity);
  };

  const handleRemoveItem = (itemId, size) => {
    updateCart(itemId, size, 0);
    getCart();
  };

  return (
    <div className="border-t pt-14 px-4 sm:px-6 lg:px-8">
      <div className="text-2xl mb-6">
        <Title text1="Your " text2="Cart" />
      </div>

      <div className="space-y-4">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                  src={productData?.image[0]}
                  alt={productData?.name}
                />
                <div>
                  <p className="text-sm sm:text-lg font-semibold">
                    {productData?.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm sm:text-base">
                      {currency}
                      {productData?.price}
                    </p>
                    <p className="px-2 py-1 text-xs sm:text-sm border bg-slate-50 rounded">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) =>
                  handleQuantityChange(item._id, item.size, Number(e.target.value))
                }
                type="number"
                className="w-16 sm:w-20 px-2 py-1 border rounded text-center"
                min={1}
                defaultValue={item.quantity}
              />

              <button
                onClick={() => handleRemoveItem(item._id, item.size)}
                className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
              >
                <img
                  className="w-5 h-5"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-10">
        <div className="w-full sm:w-[400px]">
          <CartTotal />
          <div className="w-full text-end mt-6">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm sm:text-base py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;