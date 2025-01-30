import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, Check, Mail, Leaf, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={assets.about}
            alt="Adaa Jaipur Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">ADAA JAIPUR</h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Celebrating the Rich Heritage of Jaipur Through Timeless Fashion
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">Our Heritage</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Adaa Jaipur was born from a deep appreciation for traditional Jaipuri craftsmanship
                and a vision to bring its elegance to the modern woman. Our journey began with
                the desire to showcase the exquisite artistry of Jaipur's textile heritage through
                our carefully curated collection of sarees, kurtis, and lehengas.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Each piece in our collection tells a story of Rajasthani culture, featuring
                traditional block prints, gota patti work, and handcrafted embellishments that
                have been perfected over generations.
              </p>
              <div className="flex items-center space-x-4">
                <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition group">
                  Explore Collection
                  <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-xl">
              <img
                src={assets.about}
                alt="Adaa Jaipur Craftsmanship"
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 px-6 lg:px-16 bg-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <Leaf className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Sustainable Fashion</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At Adaa Jaipur, sustainability is at the heart of our craftsmanship. We embrace ethical practices,
            support local artisans, and use eco-friendly fabrics to create fashion that is both stylish and responsible.
          </p>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <Users className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
            Hear from our satisfied customers who have embraced the elegance of Adaa Jaipur’s collections.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-700 italic">“Absolutely in love with the craftsmanship and attention to detail in my lehenga. Adaa Jaipur never disappoints!”</p>
              <p className="font-bold mt-4">— Priya Sharma</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-700 italic">“The fabrics and prints are stunning! I feel a deep connection to Jaipur’s heritage through Adaa’s designs.”</p>
              <p className="font-bold mt-4">— Anjali Verma</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-12 rounded-3xl">
            <Mail className="w-16 h-16 mx-auto mb-6 text-purple-600" />
            <h2 className="text-3xl font-bold mb-4">Get 20% Off Your First Purchase</h2>
            <p className="text-gray-700 mb-8">
              Subscribe to stay updated on new collections, traditional fashion tips, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;