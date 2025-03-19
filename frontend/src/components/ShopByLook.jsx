import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import VideoProductItem from './VideoProductItem';

const ShopByLook = () => {
  // Example looks with products that can be added to cart
  const lookProducts = [
    {
      id: '1',
      name: 'Floral Embroidered Saree',
      price: 2499,
      discountPercentage: 10,
      image: 'https://images.unsplash.com/photo-1611042553484-d61f84d22784?w=800&auto=format&fit=crop',
      // Using sample videos from a free stock video site
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-a-traditional-dress-in-a-nature-39878-large.mp4',
      sizes: ['Free Size']
    },
    {
      id: '2',
      name: 'Designer Wedding Lehenga',
      price: 4999,
      discountPercentage: 5,
      image: 'https://images.unsplash.com/photo-1596883040053-a5680a358d67?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-in-a-stylish-outfit-posing-in-the-desert-39877-large.mp4',
      sizes: ['S', 'M', 'L']
    },
    {
      id: '3',
      name: 'Handcrafted Designer Gown',
      price: 3999,
      discountPercentage: 0,
      image: 'https://images.unsplash.com/photo-1669226967122-2066d9ed6edf?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-a-nature-setting-39879-large.mp4',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '4',
      name: 'Traditional Anarkali Suit',
      price: 2199,
      discountPercentage: 15,
      image: 'https://images.unsplash.com/photo-1610030469668-39e95fc1ec04?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-outdoors-surrounded-by-leaves-39884-large.mp4',
      sizes: ['S', 'M', 'L']
    }
  ];

  const scrollLeft = () => {
    document.getElementById('shopByLookContainer').scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    document.getElementById('shopByLookContainer').scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Shop The Look</h2>
          <p className="text-lg text-gray-600 mt-2">
            Hover over products to see them in action and shop directly
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 -ml-4 hidden sm:block"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 -mr-4 hidden sm:block"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>

          {/* Products Slider */}
          <div 
            id="shopByLookContainer"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {lookProducts.map((product) => (
              <div key={product.id} className="min-w-[250px] sm:min-w-[280px] flex-shrink-0 snap-start">
                <VideoProductItem
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discountPercentage={product.discountPercentage}
                  image={product.image}
                  videoUrl={product.videoUrl}
                  sizes={product.sizes}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Hover over any product to see it in action, or tap on mobile
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopByLook; 