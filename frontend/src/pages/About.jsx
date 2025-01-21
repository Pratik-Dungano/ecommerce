import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* About Us Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-6">ABOUT US</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <img
              src={assets.about_img}
              alt="About Us"
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <div className="flex-1">
            <p className="text-lg text-gray-700 mb-4">
              Forever was born out of a passion for innovation and a desire to
              revolutionize the way people shop online. Our journey began with a
              simple idea: to provide a platform where customers can easily
              discover, explore, and purchase a wide range of products from the
              comfort of their homes.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Since our inception, we've worked tirelessly to curate a diverse
              selection of high-quality products that cater to every taste and
              preference. From fashion and beauty to electronics and home
              essentials, we offer an extensive collection sourced from trusted
              brands and suppliers.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Our Mission
            </h3>
            <p className="text-lg text-gray-700">
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-6">WHY CHOOSE US</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Quality Assurance:
            </h4>
            <p className="text-gray-700">
              We meticulously select and vet each product to ensure it meets our
              stringent quality standards.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Convenience:
            </h4>
            <p className="text-gray-700">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Exceptional Customer Service:
            </h4>
            <p className="text-gray-700">
              Our team of dedicated professionals is here to assist you every
              step of the way, ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="text-center">
        <h3 className="text-2xl font-bold mb-4">Subscribe now & get 20% off</h3>
        <p className="text-gray-700 mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
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

export default About;
