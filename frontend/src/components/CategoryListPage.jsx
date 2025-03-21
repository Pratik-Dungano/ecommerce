import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { assets } from '../assets/assets';
import axios from 'axios';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryRefs = useRef([]);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch featured categories
  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/category/featured`);
        
        if (response.data.success && response.data.categories) {
          setCategories(response.data.categories);
        } else {
          // Fallback to default categories if no featured ones are found
          setCategories([]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching featured categories:', error);
        setError('Failed to load categories');
        // Continue with fallback categories
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCategories();
  }, [backendUrl]);

  // Animation effect
  useEffect(() => {
    // Reset refs array when categories change
    categoryRefs.current = categoryRefs.current.slice(0, categories.length);
    
    categoryRefs.current.forEach((ref) => {
      if (ref) {
        gsap.set(ref, { scale: 0.8, rotateY: -60, rotateX: 20, opacity: 0 });
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            gsap.to(card, {
              duration: 1.2,
              scale: 1,
              rotateY: 0,
              rotateX: 0,
              opacity: 1,
              ease: "power3.out",
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    categoryRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  // Fallback categories in case API fails or no featured categories
  const fallbackCategories = [
    { name: "Saree", img: assets.saree2, link: "/category/saree", slug: "saree" },
    { name: "Lehenga", img: assets.lengha1, link: "/category/lehenga", slug: "lehenga" },
    { name: "Kurtas", img: assets.kurta1, link: "/category/kurtas", slug: "kurtas" },
    { name: "Gown", img: assets.gown1, link: "/category/gown", slug: "gown" }
  ];

  // Use API categories if available, otherwise use fallback
  const displayCategories = categories.length > 0 
    ? categories.map(cat => ({
        name: cat.name,
        img: cat.image || assets[cat.slug] || assets.placeholder,
        link: `/category/${cat.slug}`,
        slug: cat.slug
      }))
    : fallbackCategories.map(cat => ({
        ...cat,
        link: `/category/${cat.slug}`
      }));

  if (loading) {
    return (
      <section className="py-10">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // If no categories to display, don't render the section
  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <main>
      <section className="bg-transparent py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Shop by Category</h1>
          <p className="text-lg text-gray-600 mt-4">
            Discover a variety of categories tailored to your style.
          </p>
        </div>
      </section>

      <section className="my-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                ref={(el) => (categoryRefs.current[index] = el)}
                className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-500 transform hover:scale-105"
              >
                <div className="w-full h-96 overflow-hidden">
                  <img 
                    src={category.img} 
                    alt={category.name} 
                    className="w-full h-full object-cover object-center transition duration-500 ease-in-out transform group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-2xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoryListPage;