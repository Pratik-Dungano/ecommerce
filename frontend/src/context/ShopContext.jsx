import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishListItems, setWishListItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Reflect login status based on token
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

  const getWishList = async () => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/wishlist/get`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setWishListItems(response.data.wishList.items || []);
        }
      } catch (error) {
        // Handle error silently without logging or showing a toast
      }
    }
  };

  // Add item to the cart
  const addToCart = async (itemId, size) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }

    if (!size) {
      toast.error("Please select a size.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cart.items); // Sync with backend
        toast.success("Item added to the cart successfully!");
      }
    } catch (error) {
      toast.error("Failed to add item to the cart.");
    }
  };

  const addToWishList  = async (itemId, size) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to add items to your wishlist.");
      return;
    }

    if (!size) {
      toast.error("Please select a size.");
      return;
    }

    try {
      const response = await axios.post(
          `${backendUrl}/api/wishlist/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setWishListItems(response.data.wishList.items); // Sync with backend
        toast.success("Item added to the wishlist successfully!");
      }
    } catch (error) {
      toast.error("Failed to add item to the wishlist.");
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

  const updateWishList = async (itemId, size, quantity) => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/wishlist/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setWishListItems(response.data.wishList.items); // Sync with backend
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
          toast.success("Order placed successfully!");
          navigate("/orders");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to place the order.");
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

  const getWishListCount = () => {
    return wishListItems.reduce((total, item) => total + item.quantity, 0);
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
    if (token) {
      setIsLoggedIn(true); // Set logged-in status when token is available
      getCart(); // Fetch cart data when token is available
      getWishList(); // Fetch wishlist data when token is available
      getUserOrders(); // Fetch user orders when token is available
    } else {
      setIsLoggedIn(false); // Set logged-out status if token is not available
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
    setCartItems,
    cartItems,
    addToCart,
    getCart,
    updateCart,
    getCartCount,
    addToWishList,
    updateWishList,
    getWishListCount,
    getWishList,
    wishListItems,
    getCartAmount,
    placeOrder,
    orders,
    getUserOrders,
    navigate,
    backendUrl,
    token,
    setToken,
    isLoggedIn,
    setWishListItems,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
