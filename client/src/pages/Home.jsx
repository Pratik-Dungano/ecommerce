import React from 'react';
import FeaturedCategories from '../components/FeaturedCategories';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Your Store
          </h1>
          <p className="text-xl mb-8">
            Discover amazing products in our featured categories
          </p>
        </div>
      </section>

      {/* Featured Categories Section */}
      <FeaturedCategories />

      {/* Additional sections can be added here */}
    </div>
  );
};

export default Home; 