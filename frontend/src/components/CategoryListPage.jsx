import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { assets } from '../assets/assets';

const CategoryListPage = () => {
  const categoryRefs = useRef([]);

  useEffect(() => {
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
      { threshold: 0.5 }
    );

    categoryRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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
            <Link
              to="/category/saree"
              ref={(el) => (categoryRefs.current[0] = el)}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform-gpu"
            >
              <img src={assets.saree} alt="Saree" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-semibold">Saree</h3>
              </div>
            </Link>

            <Link
              to="/category/lehenga"
              ref={(el) => (categoryRefs.current[1] = el)}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform-gpu"
            >
              <img src={assets.lehanga} alt="Lehenga" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-semibold">Lehenga</h3>
              </div>
            </Link>

            <Link
              to="/category/kurtas"
              ref={(el) => (categoryRefs.current[2] = el)}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform-gpu"
            >
              <img src={assets.kurta} alt="Kurtas" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-semibold">Kurtas</h3>
              </div>
            </Link>

            <Link
              to="/category/gown"
              ref={(el) => (categoryRefs.current[3] = el)}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform-gpu"
            >
              <img src={assets.gown} alt="Gown" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-semibold">Gown</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoryListPage;
