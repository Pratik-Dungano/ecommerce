import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import VideoProductItem from './VideoProductItem';
import axios from 'axios';

// Helper function to get the first video URL (handles both string and array formats)
const getVideoUrl = (videoField) => {
  if (!videoField) return '';
  if (Array.isArray(videoField)) return videoField[0] || '';
  return videoField; // If it's a string
};

// Helper function to get the first image URL
const getImageUrl = (imageField) => {
  if (!imageField) return '';
  if (Array.isArray(imageField)) return imageField[0] || '';
  return imageField; // Just in case it's a string
};

const ShopLooks = () => {
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLook, setActiveLook] = useState(0);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backendUrl}/api/looks/active`);
        
        if (response.data.success && response.data.looks && response.data.looks.length > 0) {
          setLooks(response.data.looks);
        } else {
          setLooks([]);
          console.log('No active looks found or empty response');
        }
      } catch (error) {
        console.error('Error fetching looks:', error);
        setError('Failed to load looks data');
        setLooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLooks();
  }, [backendUrl]);

  const prevLook = () => {
    setActiveLook((prev) => (prev - 1 + looks.length) % looks.length);
  };

  const nextLook = () => {
    setActiveLook((prev) => (prev + 1) % looks.length);
  };

  if (loading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (looks.length === 0) {
    return null; // Don't show this section if there are no looks
  }

  // Find the currently active look
  const currentLook = looks[activeLook];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-2">
          <h2 className="text-4xl font-bold text-gray-800">Shop By Look</h2>
          <p className="text-lg text-gray-600 mt-2">
            Hover over products to see them in action and shop directly
          </p>
        </div>
 {/* Look Navigation */}
 {looks.length > 1 && (
          <div className="flex justify-center ">
            <div className="flex items-center gap-4">
              <button 
                onClick={prevLook}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                {looks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveLook(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeLook ? "bg-black w-6" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to look ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextLook}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
        {/* Products Grid */}
        <div 
          id={`look-products-${currentLook._id}`}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4"
        >
          {currentLook.products
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((product) => (
              <div key={product.productId._id} className="w-full scale-95">
                <VideoProductItem
                  id={product.productId._id}
                  name={product.productId.name}
                  price={product.productId.price}
                  discountPercentage={product.productId.discountPercentage}
                  image={getImageUrl(product.productId.image)}
                  videoUrl={getVideoUrl(product.productId.video)}
                  sizes={product.productId.sizes}
                />
              </div>
            ))}
        </div>

       

        
      </div>
    </section>
  );
};

export default ShopLooks;
