import React, { useContext, memo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = memo(({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext); // Access currency from context
  const displayCurrency = currency || "$"; // Default currency fallback

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden w-48 h-64 flex flex-col items-center">
        <img
          className="w-full h-48 object-cover hover:scale-110 transition-transform ease-in-out rounded-md"
          src={image[0]}
          alt={`Product image of ${name}`} // More descriptive alt text for accessibility
        />
        <p className="pt-3 pb-2 text-sm text-center">{name}</p>
        <p className="text-lg font-semibold">{displayCurrency}{price}</p> {/* Increased font size */}
      </div>
    </Link>
  );
});

export default ProductItem;
