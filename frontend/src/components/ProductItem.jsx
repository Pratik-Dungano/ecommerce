import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext); // Access the currency from context

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img
          className='hover:scale-110 transition-transform ease-in-out'
          src={image[0]} 
          alt={`${name} image`} // Improved accessibility with a more descriptive alt text
        />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>
        {currency || '$'}{price} {/* Fallback currency if none is provided */}
      </p>
    </Link>
  );
};

export default ProductItem;
