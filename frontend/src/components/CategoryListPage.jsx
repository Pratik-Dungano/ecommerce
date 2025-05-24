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

  // Hover colors for each category
  const hoverColors = [
    "rgba(59, 130, 246, 0.5)", // blue
    "rgba(147, 51, 234, 0.5)",  // purple
    "rgba(236, 72, 153, 0.5)",   // pink
    "rgba(34, 197, 94, 0.5)"     // green
  ];

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
      <section className="bg-transparent py-10">
        <div className="container mx-auto px-6">
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
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Shop by Category</h1>
            <p className="text-lg text-gray-600 mt-2">
              Discover a variety of categories tailored to your style.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                ref={(el) => (categoryRefs.current[index] = el)}
                className="cursor-pointer bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-110 hover:shadow-2xl relative group"
              >
                <img 
                  src={category.img} 
                  alt={category.name} 
                  className="w-full h-full object-cover rounded-md"
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: hoverColors[index % hoverColors.length] }}
                >
                  <span className="text-white text-xl font-bold">{category.name}</span>
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