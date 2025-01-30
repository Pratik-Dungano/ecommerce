import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { assets } from "../assets/assets";
import gsap from "gsap";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const containerRef = useRef();
  const videoRefs = useRef([]);

  const slides = [
    { id: 1, type: "video", src: assets.hero_video1, alt: "Hero Video 1" },
    { id: 2, type: "image", src: assets.hero_image_1, alt: "Hero Image 1" },
    { id: 3, type: "image", src: assets.hero_image_2, alt: "Hero Image 2" },
    { id: 4, type: "image", src: assets.hero_image_3, alt: "Hero Image 3" },
  ];

  const handleScroll = (e) => {
    if (scrolling) return;
    setScrolling(true);
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextSlide = (currentSlide + direction + slides.length) % slides.length;

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setCurrentSlide(nextSlide);
        gsap.to(containerRef.current, { opacity: 1, duration: 0.5 });
        if (slides[nextSlide].type === "video" && videoRefs.current[nextSlide]) {
          videoRefs.current[nextSlide].currentTime = 0;
          videoRefs.current[nextSlide].play();
        }
      },
    });
    setTimeout(() => setScrolling(false), 800);
  };

  useEffect(() => {
    if (slides[0].type === "video" && videoRefs.current[0]) {
      videoRefs.current[0].currentTime = 0;
      videoRefs.current[0].play();
    }
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [currentSlide, scrolling]);

  return (
    <div ref={containerRef} className="relative overflow-hidden h-screen w-full">
      <div className="relative w-full h-full flex items-center justify-center">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            {slide.type === "image" ? (
              <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
            ) : (
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={slide.src}
                className="w-full h-full object-cover"
                muted
                loop
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 flex justify-center space-x-4 w-full">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-4 h-4 rounded-full transition-all ${idx === currentSlide ? "bg-white w-6" : "bg-gray-400 hover:w-5"}`}
          ></button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-gray-800/40 text-white p-2 rounded-full"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-gray-800/40 text-white p-2 rounded-full"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

export default Hero;