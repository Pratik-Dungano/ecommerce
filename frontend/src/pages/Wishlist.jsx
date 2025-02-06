import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Wishlist = () => {
  const { products, currency, wishListItems, updateWishList, getWishList, addToCart } =
    useContext(ShopContext);
  const [wishlistData, setWishlistData] = useState([]);

  // Fetch wishlist data on component mount
  useEffect(() => {
    getWishList();
  }, []);

  // Update wishlistData whenever wishListItems changes
  useEffect(() => {
    const tempData = wishListItems.map((item) => ({
      _id: item.itemId,
      size: item.size,
      quantity: item.quantity,
    }));
    setWishlistData(tempData);
  }, [wishListItems]);

  const handleQuantityChange = (itemId, size, quantity) => {
    if (quantity === "" || quantity === 0) {
      return;
    }
    updateWishList(itemId, size, quantity);
  };

  const handleRemoveItem = (itemId, size) => {
    updateWishList(itemId, size, 0);
    getWishList();
  };

  const handleAddToCart = (itemId, size, quantity) => {
    addToCart(itemId, size, quantity);
    updateWishList(itemId, size, 0); // Remove from wishlist
    getWishList();
  };

  const getDiscountedPrice = (product) => {
    if (!product) return 0;
    return product.discountPercentage > 0
      ? Math.round(product.price - (product.price * product.discountPercentage / 100))
      : product.price;
  };

  return (
    <div className="border-t pt-14 px-6 sm:px-10 lg:px-20">
      <div className="text-2xl mb-3">
        <Title text1="Your " text2="Wishlist" />
      </div>

      <div>
        {wishlistData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          const discountedPrice = getDiscountedPrice(productData);

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData?.image[0]}
                  alt={productData?.name}
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData?.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {productData?.discountPercentage > 0 ? (
                      <>
                        <p className="text-sm sm:text-base font-semibold">
                          {currency}{discountedPrice}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          {currency}{productData?.price}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          {productData?.discountPercentage}% off
                        </p>
                      </>
                    ) : (
                      <p>
                        {currency}{productData?.price}
                      </p>
                    )}
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
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
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => handleRemoveItem(item._id, item.size)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove"
              />
              <img
                onClick={() => handleAddToCart(item._id, item.size, item.quantity)}
                className="w-4 sm:w-5 cursor-pointer"
                src={assets.cart_icon}
                alt="Add to Cart"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
