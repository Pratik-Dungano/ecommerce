import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Contact Us Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-6">CONTACT US</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Image */}
          <div className="flex-1">
            <img
              src={assets.contact_image}// Replace with your image path
              alt="Contact Us"
              className="w-full rounded-lg shadow-md"
            />
          </div>
          {/* Contact Information */}
          <div className="flex-1 text-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Store</h3>
            <p className="mb-2">54709 Willms Station</p>
            <p className="mb-2">Suite 350, Washington, USA</p>
            <p className="mb-2">Tel: (415) 555-0132</p>
            <p className="mb-6">Email: admin@forever.com</p>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Careers at Forever
            </h3>
            <p className="mb-4">
              Learn more about our teams and job openings.
            </p>
            <button className="px-4 py-2 border rounded-md text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white">
              Explore Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="text-center">
        <h3 className="text-2xl font-bold mb-4">Subscribe now & get 20% off</h3>
        <p className="text-gray-700 mb-4">
          Stay updated with our latest products and offers.
        </p>
        <div className="flex justify-center items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded-l-md w-full max-w-sm"
          />
          <button className="bg-black text-white px-4 py-2 rounded-r-md">
            SUBSCRIBE
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;
