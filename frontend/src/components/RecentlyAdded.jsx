import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Eye, ShoppingCart, Heart, ArrowLeft, ArrowRight, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentlyAdded = () => {
  const { products, addToCart, addToWishList, isLoggedIn } = useContext(ShopContext);
  const [recentProducts, setRecentProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    if (products && products.length > 0) {
      // Sort products by createdAt in descending order (newest first)
      const sortedProducts = [...products].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      // Get the 8 most recently added products
      const recent = sortedProducts.slice(0, 8);
      setRecentProducts(recent);
    }
  }, [products]);

  useEffect(() => {
    let interval;
    if (autoplay && recentProducts.length > 4) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          (prevIndex + 1) % (recentProducts.length - 3)
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, recentProducts]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) =>
      prevIndex >= recentProducts.length - 4 ? prevIndex : prevIndex + 1
    );
  };

  if (!recentProducts || recentProducts.length === 0) {
    return null;
  }

  const visibleProducts =
    recentProducts.length > 4
      ? recentProducts.slice(currentIndex, currentIndex + 4)
      : recentProducts;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-blue-500" size={28} />
            <h2 className="text-4xl font-bold text-blue-600">
              Just Arrived
            </h2>
            <Sparkles className="text-blue-500" size={28} />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our newest additions - fresh styles and trending pieces to elevate your wardrobe
          </p>
        </div>

        <div className="relative">
          {recentProducts.length > 4 && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full shadow-xl p-3 disabled:opacity-30 hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <ArrowLeft size={24} className="text-blue-600" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex >= recentProducts.length - 4}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full shadow-xl p-3 disabled:opacity-30 hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <ArrowRight size={24} className="text-blue-600" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {visibleProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                isHovered={hoveredProduct === item._id}
                onHover={() => setHoveredProduct(item._id)}
                onLeave={() => setHoveredProduct(null)}
                onAddToCart={(size) => addToCart(item._id, size)}
                onAddToWishList={(size) => addToWishList(item._id, size)}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </div>

        {recentProducts.length > 4 && (
          <div className="flex justify-center mt-8 gap-3">
            {Array.from({ length: recentProducts.length - 3 }).map(
              (_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? "bg-blue-500 scale-125" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoplay(false);
                  }}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const ProductCard = ({
  product,
  isHovered,
  onHover,
  onLeave,
  onAddToCart,
  onAddToWishList,
  isLoggedIn,
}) => {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const navigate = useNavigate();

  const originalPrice = product.price;
  const discountedPrice = product.discountPercentage
    ? (originalPrice * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please sign in to add items to your wishlist.");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size before adding to your wishlist.");
      return;
    }
    onAddToWishList(selectedSize);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) {
      alert("Please select a size before adding to your cart.");
      return;
    }
    onAddToCart(selectedSize);
  };

  const handleProductClick = () => {
    window.scrollTo(0, 0);
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleProductClick}
    >
      {/* Badge overlays */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* NEW badge with animation */}
        <div className="bg-blue-500 text-white font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
          <Sparkles size={12} />
          NEW
        </div>
        
        {product.discountPercentage > 0 && (
          <div className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs">
            -{product.discountPercentage}%
          </div>
        )}
        
        {product.ecoFriendly && (
          <div className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs">
            Eco
          </div>
        )}
        
        {product.bestseller && (
          <div className="bg-yellow-500 text-white font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <Star size={12} className="fill-current" />
            Trending
          </div>
        )}
      </div>

      {/* Image container with enhanced overlay */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div
          className={`absolute inset-0 flex items-center justify-center gap-4 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
            <Eye size={20} />
          </button>
          <button
            onClick={handleAddToCartClick}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={handleLikeClick}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Product info with enhanced styling */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-4">
          {discountedPrice ? (
            <>
              <span className="text-xl font-bold text-blue-600">
                ₹{discountedPrice}
              </span>
              <span className="text-gray-500 line-through text-sm">
                ₹{originalPrice}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-blue-600">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-3 py-1 text-xs border rounded-lg transition-all duration-300 ${
                  selectedSize === size
                    ? "border-blue-500 bg-blue-500 text-white shadow-md"
                    : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCartClick}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 transform ${
            isHovered
              ? "bg-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Add to Cart
        </button>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
};

export default RecentlyAdded;