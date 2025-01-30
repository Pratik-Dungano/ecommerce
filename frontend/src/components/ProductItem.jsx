// ProductItem.jsx
import React, { useContext, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { ShoppingCart, Heart } from "react-feather";

const ProductItem = memo(({ id, image, name, price, sizes }) => {
    const { 
        addToCart, 
        addToWishList, 
        isLoggedIn, 
        currency, 
        wishListItems 
    } = useContext(ShopContext);
    
    const navigate = useNavigate();
    const displayCurrency = currency || "$";
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedWishlistSize, setSelectedWishlistSize] = useState("");
    const [showSizeOptions, setShowSizeOptions] = useState(false);
    const [showWishlistSizeOptions, setShowWishlistSizeOptions] = useState(false);

    const isInWishlist = wishListItems.some(item => item.itemId === id);

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
        alert(`${name} (Size: ${selectedWishlistSize}) has been added to your wishlist!`);
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
        alert(`${name} (Size: ${selectedSize}) has been added to your cart!`);
        setShowSizeOptions(false);
        setSelectedSize("");
    };

    return (
        <div
            className="relative group transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate(`/product/${id}`)}
        >
            <div className="relative overflow-hidden rounded-md shadow-md transition-shadow duration-300 ease-in-out group-hover:shadow-xl w-full h-full flex flex-col">
                <div className="relative overflow-hidden" style={{ paddingTop: "100%" }}>
                    <img
                        src={image[0] || "/placeholder.svg"}
                        alt={`Product image of ${name}`}
                        className="absolute top-0 left-0 w-full h-full object-cover object-top"
                    />
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

                <div className="p-3 bg-white flex-grow">
                    <h3 className="text-xs font-medium text-gray-900 truncate mb-1">{name}</h3>
                    <p className="text-xs text-gray-500">
                        {displayCurrency}{price}
                    </p>
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