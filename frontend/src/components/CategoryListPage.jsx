import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const CategoryListPage = () => {
  const categories = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/1852382/pexels-photo-1852382.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
      title: "SHIRT STYLE!",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/594610/pexels-photo-594610.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
      title: "DENIMS",
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/449977/pexels-photo-449977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      title: "LEATHER JACKETS",
    },
    {
      id: 4,
      image:
        "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      title: "HOODIES",
    },
  ];

  const categoryRefs = useRef([]);
  const collectionRef = useRef();

  useEffect(() => {
    // Initialize categories with entrance animation
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

    // Observe all category cards
    categoryRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    // Observe the collection section for exit animation
    const collectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            categoryRefs.current.forEach((ref) => {
              if (ref) {
                gsap.to(ref, {
                  duration: 1.2,
                  scale: 0.8,
                  rotateY: 60,
                  rotateX: -20,
                  opacity: 0,
                  ease: "power3.in",
                });
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (collectionRef.current) {
      collectionObserver.observe(collectionRef.current);
    }

    return () => {
      observer.disconnect();
      collectionObserver.disconnect();
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                ref={(el) => (categoryRefs.current[index] = el)}
                className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform-gpu"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-semibold">
                    {category.title}
                  </h3>
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
