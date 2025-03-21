import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishListItems, setWishListItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Reflect login status based on token
  const navigate = useNavigate();

  // Fetch products from the backend
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data?.products) {
        // Add category and subcategory names to each product for easier filtering and display
        const productsWithDetails = await Promise.all(
          response.data.products.map(async (product) => {
            // First try to get names from categories cache
            if (categories.length > 0) {
              const category = categories.find(cat => cat._id === product.categoryId);
              if (category) {
                const subcategory = category.subcategories?.find(sub => sub._id === product.subcategoryId);
                return {
                  ...product,
                  categoryName: category.name,
                  subcategoryName: subcategory?.name || ''
                };
              }
            }
            return product;
          })
        );
        setProducts(productsWithDetails);
        console.log('Products loaded:', productsWithDetails.length);
      }
    } catch (error) {
      // Handle error silently without logging or showing a toast
      console.error('Error fetching products:', error);
    }
  };

  // Fetch categories from the backend
  const getCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`);
      if (response.data?.success) {
        setCategories(response.data.categories);
        return response.data.categories;
      }
      return [];
    } catch (error) {
      // Handle error silently without logging or showing a toast
      console.error('Error fetching categories:', error);
      return [];
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
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCartItems(response.data.cart.items);
        toast.success("Item added to cart!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item to cart");
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
          amount: getTotal() + delivery_fee,
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

  const getProductPrice = (productId) => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      return product.discountPercentage > 0 
        ? Math.round(product.price - (product.price * product.discountPercentage / 100))
        : product.price;
    }
    return 0;
  };

  const getTotalCartAmount = () => {
    let total = 0;
    cartItems.forEach((item) => {
      const itemPrice = getProductPrice(item.itemId);
      total += itemPrice * item.quantity;
    });
    return total;
  };

  const getSubTotal = () => {
    return getTotalCartAmount();
  };

  const getTotal = () => {
    return getSubTotal() + delivery_fee;
  };

  // Load data when component mounts
  useEffect(() => {
    // First load categories, then products
    getCategories().then(() => {
      getProductsData();
    });
    
    if (token) {
      getCart();
      getWishList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true); // Set logged-in status when token is available
      getUserOrders(); // Fetch user orders when token is available
    } else {
      setIsLoggedIn(false); // Set logged-out status if token is not available
    }
  }, [token]);

  // Define the context value
  const value = {
    products,
    categories,
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
    getTotalCartAmount,
    placeOrder,
    orders,
    getUserOrders,
    navigate,
    backendUrl,
    token,
    setToken,
    isLoggedIn,
    setWishListItems,
    getSubTotal,
    getTotal,
    getProductPrice,
    getCategories,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
