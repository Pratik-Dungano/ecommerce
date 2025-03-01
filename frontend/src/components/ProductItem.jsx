// ProductItem.jsx
import React, { useContext, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { ShoppingCart, Heart, Award, Video } from "react-feather";
import { FaLeaf } from "react-icons/fa";

const ProductItem = memo(({ id, image, name, price, sizes, discountPercentage, ecoFriendly, video }) => {
    const { 
        addToCart, 
        addToWishList, 
        isLoggedIn, 
        currency, 
        wishListItems 
    } = useContext(ShopContext);
    
    const navigate = useNavigate();
    const displayCurrency = currency || "₹";
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedWishlistSize, setSelectedWishlistSize] = useState("");
    const [showSizeOptions, setShowSizeOptions] = useState(false);
    const [showWishlistSizeOptions, setShowWishlistSizeOptions] = useState(false);

    const isInWishlist = wishListItems.some(item => item.itemId === id);
    const originalPrice = price;
    const discountedPrice = discountPercentage > 0 ? Math.round(originalPrice - (originalPrice * discountPercentage / 100)) : originalPrice;

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            alert("Please sign in to add items to your wishlist.");
            return;
        }
        setShowWishlistSizeOptions(true);
    };

    const handleAddToWishlist = (e) => {
        e.stopPropagation();
        if (!selectedWishlistSize) {
            alert("Please select a size before adding to wishlist.");
            return;
        }
        addToWishList(id, selectedWishlistSize);
        setShowWishlistSizeOptions(false);
        setSelectedWishlistSize("");
    };

    // Existing cart handling functions
    const handleSelectSize = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            alert("Please sign in to add items to your cart.");
            return;
        }
        if (!selectedSize) {
            alert("Please select a size before adding to the cart.");
            return;
        }
        addToCart(id, selectedSize);
        setShowSizeOptions(false);
        setSelectedSize("");
    };

    return (
        <div 
            className={`relative group transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                ecoFriendly 
                    ? 'eco-friendly ring-1 ring-green-200 hover:ring-green-300 hover:shadow-lg hover:shadow-green-200/70' 
                    : ''
            }`}
            style={{
                background: ecoFriendly ? 'linear-gradient(to bottom, rgba(144, 238, 144, 0.1), transparent)' : 'none',
                transition: 'all 0.3s ease-in-out'
            }}
            onClick={() => {
              navigate(`/product/${id}`);
              window.scrollTo(0, 0);
            }}
        >
            <div className="relative overflow-hidden rounded-md shadow-md transition-shadow duration-300 ease-in-out group-hover:shadow-xl w-full h-full flex flex-col">
                <div className="relative overflow-hidden" style={{ paddingTop: "100%" }}>
                    <img
                        src={image[0] || "/placeholder.svg"}
                        alt={`Product image of ${name}`}
                        className="absolute top-0 left-0 w-full h-full object-cover object-top"
                    />
                    {ecoFriendly && (
                        <div className="eco-badge absolute top-2 left-2 bg-green-50/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <FaLeaf className="text-green-600" size={14} />
                            <span className="text-xs font-medium text-green-700">Eco</span>
                        </div>
                    )}
                    {video && (
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <Video className="text-white" size={14} />
                            <span className="text-xs font-medium text-white">Video</span>
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-2 left-2 bg-gray-800 text-white p-1.5 rounded-full opacity-0 
                            group-hover:opacity-100 transition-all duration-300 hover:bg-gray-600 hover:scale-110"
                    aria-label="Add to Wishlist"
                >
                    <Heart 
                        size={16} 
                        className={`${isInWishlist ? 'text-red-500 fill-current' : 'text-white fill-transparent'}`}
                        strokeWidth={2}
                    />
                </button>

                {/* Cart Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowSizeOptions(true);
                    }}
                    className="absolute top-2 right-2 bg-gray-800 text-white p-1.5 rounded-full opacity-0 
                            group-hover:opacity-100 transition-all duration-300 hover:bg-gray-600 hover:scale-110"
                    aria-label="Add to Cart"
                >
                    <ShoppingCart size={16} />
                </button>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                        <span>{name}</span>
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
                        {discountPercentage > 0 && (
                            <span className="text-xs text-green-600 mt-0.5">
                                Save {displayCurrency}{Math.round(originalPrice - discountedPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Wishlist Size Selection Modal */}
            {showWishlistSizeOptions && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-md shadow-lg w-80">
                        <h2 className="text-lg font-semibold mb-3">Select a Size for Wishlist</h2>
                        <div className="flex gap-2 flex-wrap">
                            {sizes?.map((size) => (
                                <button
                                    key={size}
                                    className={`px-3 py-1 border rounded ${selectedWishlistSize === size ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedWishlistSize(size);
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end mt-3">
                            <button
                                className="mr-2 px-3 py-1 bg-gray-400 text-white rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowWishlistSizeOptions(false);
                                    setSelectedWishlistSize("");
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-3 py-1 bg-green-500 text-white rounded" 
                                onClick={handleAddToWishlist}
                            >
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Size Selection Modal */}
            {showSizeOptions && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-md shadow-lg w-80">
                        <h2 className="text-lg font-semibold mb-3">Select a Size</h2>
                        <div className="flex gap-2 flex-wrap">
                            {sizes?.map((size) => (
                                <button
                                    key={size}
                                    className={`px-3 py-1 border rounded ${selectedSize === size ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectSize(size);
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end mt-3">
                            <button
                                className="mr-2 px-3 py-1 bg-gray-400 text-white rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSizeOptions(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-3 py-1 bg-green-500 text-white rounded" 
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ProductItem;