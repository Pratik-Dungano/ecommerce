import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Eye, ShoppingCart, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BestSellers = () => {
  const { products, addToCart, addToWishList, isLoggedIn } = useContext(ShopContext);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestSellers = products
        .filter((product) => product.bestseller === true)
        .slice(0, 8);
      setBestSellerProducts(bestSellers);
    }
  }, [products]);

  useEffect(() => {
    let interval;
    if (autoplay && bestSellerProducts.length > 4) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          (prevIndex + 1) % (bestSellerProducts.length - 3)
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, bestSellerProducts]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) =>
      prevIndex >= bestSellerProducts.length - 4 ? prevIndex : prevIndex + 1
    );
  };

  if (!bestSellerProducts || bestSellerProducts.length === 0) {
    return null;
  }

  const visibleProducts =
    bestSellerProducts.length > 4
      ? bestSellerProducts.slice(currentIndex, currentIndex + 4)
      : bestSellerProducts;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Best Sellers</h2>
          <p className="text-lg text-gray-600 mt-2">
            Our most popular items loved by customers
          </p>
        </div>

        <div className="relative">
          {bestSellerProducts.length > 4 && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full shadow-lg p-2 disabled:opacity-30"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex >= bestSellerProducts.length - 4}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full shadow-lg p-2 disabled:opacity-30"
              >
                <ArrowRight size={24} />
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

        {bestSellerProducts.length > 4 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: bestSellerProducts.length - 3 }).map(
              (_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex === index ? "bg-blue-600" : "bg-gray-300"
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
    window.scrollTo(0, 0); // Scroll to the top of the page
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="relative group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleProductClick}
    >
      {/* Badge overlays */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        {product.discountPercentage > 0 && (
          <div className="bg-red-500 text-white font-bold px-2 py-1 rounded-md text-sm">
            -{product.discountPercentage}%
          </div>
        )}
        {product.ecoFriendly && (
          <div className="bg-green-500 text-white font-bold px-2 py-1 rounded-md text-sm">
            Eco
          </div>
        )}
        {product.bestseller && (
          <div className="bg-yellow-500 text-white font-bold px-2 py-1 rounded-md text-sm">
            Best Seller
          </div>
        )}
      </div>

      {/* Image container with quick actions overlay */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center gap-4 bg-black bg-opacity-20 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
            <Eye size={20} />
          </button>
          <button
            onClick={handleAddToCartClick}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={handleLikeClick}
            className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
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
          <div className="flex flex-wrap gap-2 mt-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // Prevent event propagation to parent
                  setSelectedSize(size);
                }}
                className={`px-2 py-1 text-xs border rounded-md transition-colors ${
                  selectedSize === size
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCartClick}
          className={`w-full mt-4 py-2 rounded-md font-medium transition-all duration-200 ${
            isHovered
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BestSellers;