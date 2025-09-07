  import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateCart, navigate, getCart, placeOrder } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const navigateToProduct = useNavigate();

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
    
    // Initialize all items as selected when cart loads
    const allItemKeys = tempData.map(item => `${item._id}-${item.size}`);
    setSelectedItems(new Set(allItemKeys));
    setSelectAll(true);
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

  const handleProductClick = (productId) => {
    navigateToProduct(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleItemSelect = (itemId, size) => {
    const itemKey = `${itemId}-${size}`;
    const newSelectedItems = new Set(selectedItems);
    
    if (newSelectedItems.has(itemKey)) {
      newSelectedItems.delete(itemKey);
    } else {
      newSelectedItems.add(itemKey);
    }
    
    setSelectedItems(newSelectedItems);
    setSelectAll(newSelectedItems.size === cartData.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      const allItemKeys = cartData.map(item => `${item._id}-${item.size}`);
      setSelectedItems(new Set(allItemKeys));
      setSelectAll(true);
    }
  };

  const getSelectedItemsData = () => {
    return cartData.filter(item => 
      selectedItems.has(`${item._id}-${item.size}`)
    );
  };

  const getDiscountedPrice = (product) => {
    if (!product) return 0;
    return product.discountPercentage > 0
      ? Math.round(product.price - (product.price * product.discountPercentage / 100))
      : product.price;
  };

  return (
    <div className="border-t pt-14 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="text-2xl mb-6">
        <Title text1="Your " text2="Cart" />
      </div>

      {/* Selection Controls */}
      {cartData.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Select All ({selectedItems.size} of {cartData.length} items)
              </label>
            </div>
            <div className="text-sm text-gray-600">
              {selectedItems.size > 0 ? `${selectedItems.size} item(s) selected` : 'No items selected'}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          const discountedPrice = getDiscountedPrice(productData);
          const isSelected = selectedItems.has(`${item._id}-${item.size}`);
          
          return (
            <div
              key={index}
              className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto] gap-4 items-center ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleItemSelect(item._id, item.size)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  src={productData?.image[0]}
                  alt={productData?.name}
                  onClick={() => handleProductClick(item._id)}
                />
                <div>
                  <p className="text-sm sm:text-lg font-semibold">
                    {productData?.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
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
                      <p className="text-sm sm:text-base">
                        {currency}{productData?.price}
                      </p>
                    )}
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
          <CartTotal selectedItems={getSelectedItemsData()} />
          <div className="w-full text-end mt-6">
            <button
              onClick={() => {
                const selectedItemsData = getSelectedItemsData();
                // Store selected items in context or pass to place order
                navigate("/place-order", { 
                  state: { selectedItems: selectedItemsData } 
                });
              }}
              disabled={selectedItems.size === 0}
              className={`text-sm sm:text-base py-3 px-8 rounded-lg transition-colors duration-200 ${
                selectedItems.size === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {selectedItems.size === 0 
                ? 'Select items to checkout' 
                : `Proceed to Checkout (${selectedItems.size} items)`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;