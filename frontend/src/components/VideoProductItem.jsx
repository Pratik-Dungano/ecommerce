import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { ShoppingCart, Heart, Video } from "react-feather";

const VideoProductItem = ({ id, image, name, price, sizes = [], videoUrl, discountPercentage = 0 }) => {
  const { addToCart, addToWishList, isLoggedIn, currency, wishListItems } = useContext(ShopContext);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  
  const displayCurrency = currency || "₹";
  const isInWishlist = wishListItems && wishListItems.some(item => item.itemId === id);
  const originalPrice = price || 0;
  const discountedPrice = discountPercentage > 0 
    ? Math.round(originalPrice - (originalPrice * discountPercentage / 100)) 
    : originalPrice;

  // Check if video URL is valid
  const hasValidVideo = Boolean(videoUrl && typeof videoUrl === 'string' && videoUrl.trim() !== '');

  // Preload video when component mounts
  useEffect(() => {
    // Only attempt to load video if URL is valid
    if (!hasValidVideo) {
      setVideoLoadError(true);
      return;
    }

    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
        setVideoLoadError(false);
      });
      
      videoRef.current.addEventListener('error', () => {
        console.error('Video failed to load:', videoUrl);
        setVideoLoadError(true);
        setVideoLoaded(false);
      });

      // Start loading the video
      videoRef.current.load();
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', () => {
          setVideoLoaded(true);
        });
        
        videoRef.current.removeEventListener('error', () => {
          setVideoLoadError(true);
        });
      }
    };
  }, [videoUrl, hasValidVideo]);

  const handleMouseEnter = () => {
    if (videoLoaded && !videoLoadError) {
      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => {
          console.log("Video play failed:", e);
          setVideoLoadError(true);
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // For touch devices
  const handleTouch = () => {
    if (!showVideo && videoLoaded && !videoLoadError) {
      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => {
          console.log("Video play failed:", e);
          setVideoLoadError(true);
        });
      }
      return;
    }
    
    handleProductClick();
  };

  const handleAddToCart = (size) => {
    if (!isLoggedIn) {
      alert("Please sign in to add items to your cart.");
      return;
    }
    
    if (!size) {
      alert("Please select a size");
      return;
    }
    
    addToCart(id, size);
    setShowSizeOptions(false);
    setSelectedSize("");
  };

  const handleProductClick = () => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please sign in to add items to your wishlist.");
      return;
    }
    
    // Use first size as default for wishlist
    const defaultSize = sizes && sizes.length > 0 ? sizes[0] : "Free Size";
    addToWishList(id, defaultSize);
  };

  return (
    <div 
      className="relative group transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
    >
      <div 
        className="relative overflow-hidden rounded-md shadow-md transition-shadow duration-300 ease-in-out 
                  group-hover:shadow-xl w-full h-full flex flex-col cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="relative overflow-hidden" style={{ paddingTop: "130%" }}>
          {/* Image (always visible when no video or video not loaded) */}
          <img
            src={image || "/placeholder.svg"}
            alt={`Product image of ${name}`}
            className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out 
                      ${showVideo && videoLoaded && !videoLoadError ? 'opacity-0' : 'opacity-100'}`}
          />
          
          {/* Video (visible when hovering and loaded) */}
          {hasValidVideo && (
            <video
              ref={videoRef}
              src={videoUrl}
              className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out 
                        ${showVideo && videoLoaded && !videoLoadError ? 'opacity-100' : 'opacity-0'}`}
              muted
              playsInline
              loop
              preload="metadata"
            />
          )}
          
          {/* Video badge - only show if video is valid */}
          {(hasValidVideo && !videoLoadError) && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Video className="text-white" size={14} />
              <span className="text-xs font-medium text-white">Video</span>
            </div>
          )}
          
          {/* Loading indicator if video is loading */}
          {hasValidVideo && !videoLoaded && !videoLoadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
            {name}
          </h3>
          <div className="mt-1 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">
                {displayCurrency}{discountedPrice}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {displayCurrency}{originalPrice}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {discountPercentage}% off
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick shop buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 
                      flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeOptions(true);
              }}
              className="bg-white text-gray-900 px-3 py-1.5 rounded shadow-md hover:bg-gray-100 text-sm font-medium flex items-center"
            >
              <ShoppingCart size={14} className="mr-1" /> Quick Add
            </button>
            <button
              onClick={handleAddToWishlist}
              className="bg-white text-gray-900 p-1.5 rounded shadow-md hover:bg-gray-100"
            >
              <Heart 
                size={16} 
                className={`${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-900 fill-transparent'}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Size selection modal */}
      {showSizeOptions && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
          onClick={(e) => {
            e.stopPropagation();
            setShowSizeOptions(false);
          }}
        >
          <div 
            className="bg-white p-4 rounded-md shadow-lg w-80" 
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3">Select a Size</h2>
            <div className="flex gap-2 flex-wrap">
              {sizes?.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded ${selectedSize === size ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <button
                className="mr-2 px-3 py-1 bg-gray-400 text-white rounded"
                onClick={() => setShowSizeOptions(false)}
              >
                Cancel
              </button>
              <button 
                className={`px-3 py-1 rounded ${!selectedSize ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                onClick={() => handleAddToCart(selectedSize)}
                disabled={!selectedSize}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProductItem; 