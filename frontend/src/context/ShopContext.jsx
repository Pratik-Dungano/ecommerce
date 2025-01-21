import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Fetch products from the backend
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data?.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      // Handle error silently without logging or showing a toast
    }
  };

  // Fetch cart data from the backend
  const getCart = async () => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setCartItems(response.data.cart.items || []);
        }
      } catch (error) {
        // Handle error silently without logging or showing a toast
      }
    }
  };

  // Add item to the cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      return; // Do nothing if size is not selected
    }

    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setCartItems(response.data.cart.items); // Sync with backend
        }
      } catch (error) {
        // Handle error silently without logging or showing a toast
      }
    }
  };

  // Update cart item quantity
  const updateCart = async (itemId, size, quantity) => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setCartItems(response.data.cart.items); // Sync with backend
        }
      } catch (error) {
        // Handle error silently without logging or showing a toast
      }
    }
  };

  // Place an order
  const placeOrder = async (address) => {
    if (token) {
      try {
        const items = cartItems.map((item) => {
          const product = products.find((p) => p._id === item.itemId);
          return {
            productId: item.itemId,
            size: item.size,
            quantity: item.quantity,
            price: product.price,
          };
        });

        const orderData = {
          items,
          address: {
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            email: address.email,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
          },
          amount: getCartAmount() + delivery_fee,
        };

        const response = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setCartItems([]); // Clear cart after order placement
          navigate("/orders");
        }
      } catch (error) {
        // Handle error silently without logging or showing a toast
      }
    }
  };

  // Fetch user orders
  const getUserOrders = async () => {
    // This function is currently not implemented
  };

  // Get the total count of items in the cart
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate the total amount of the cart
  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((product) => product._id === item.itemId);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  };

  useEffect(() => {
    getProductsData(); // Fetch products on component mount
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (token) {
      getCart(); // Fetch cart data when token is available
      getUserOrders(); // Fetch user orders when token is available
    }
  }, [token]);

  // Define the context value
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCart,
    updateCart,
    getCartCount,
    getCartAmount,
    placeOrder,
    orders,
    getUserOrders,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
