import React from "react";
import { Check } from "lucide-react";
import {assets} from "../assets/assets"
const HomeFeatures = () => {
  return (
    <div className="space-y-24">
        {/* Statistics Section */}
      <section className="py-20" 
      style={{
        backgroundImage: `url(${assets.stats_back})`, // Use the imported image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pink-100 p-8 rounded-3xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-bold text-pink-900 mb-4">10k+</h3>
              <p className="text-pink-700">Unique Designs</p>
            </div>
            <div className="bg-amber-100 p-8 rounded-3xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">50+</h3>
              <p className="text-amber-700">Master Artisans</p>
            </div>
            <div className="bg-green-100 p-8 rounded-3xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-bold text-green-900 mb-4">15+</h3>
              <p className="text-green-700">Years of Heritage</p>
            </div>
            <div className="bg-rose-100 p-8 rounded-3xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-bold text-rose-900 mb-4">100k+</h3>
              <p className="text-rose-700">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-pink-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <h2 className="text-4xl font-bold mb-16 text-center">The Adaa Difference</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authentic Craftsmanship",
                description: "Every piece is crafted by skilled artisans using traditional techniques passed down through generations.",
                icon: <Check className="w-12 h-12 text-pink-400" />,
              },
              {
                title: "Contemporary Designs",
                description: "We blend traditional Jaipuri elements with modern aesthetics to create timeless pieces for today's woman.",
                icon: <Check className="w-12 h-12 text-amber-400" />,
              },
              {
                title: "Premium Quality",
                description: "We source the finest fabrics and materials to ensure each garment meets our high standards of quality.",
                icon: <Check className="w-12 h-12 text-green-400" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-pink-900 hover:bg-pink-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-pink-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HomeFeatures;