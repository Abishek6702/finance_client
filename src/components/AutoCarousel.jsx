import React, { useEffect, useState } from "react";
import carouselimage1 from "../assets/carouselimage1.png";
import react from "../assets/react.svg";
import logo from "../assets/logo.svg";
import { ChevronRight,ChevronLeft  } from 'lucide-react';
const SLIDE_DURATION = 3000;

export default function OrbitCarousel() {
  const slides = [
    {
      image: carouselimage1,
      title: "Bills Payments Options",
      description:
        "Analyzing previous trends ensures that businesses always make the right decision...",
    },
    {
      image: carouselimage1,
      title: "Fast React Integration",
      description:
        "Build powerful UI components quickly using reusable architecture...",
    },
    {
      image: carouselimage1,
      title: "Secure Transactions",
      description:
        "We ensure every payment is encrypted and processed safely...",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto slide with progress tracking
  useEffect(() => {
    setIsAnimating(true);
    setProgress(0);

    const timer = setTimeout(() => {
      goNext();
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [current]);

  // Progress animation
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, SLIDE_DURATION / 100);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAnimating(false);
    setProgress(0);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsAnimating(false);
    setProgress(0);
  };

  const goTo = (index) => {
    setCurrent(index);
    setIsAnimating(false);
    setProgress(0);
  };

  return (
    <div className="relative w-[90%] h-[90%] rounded-4xl bg-[#0B56A4] flex flex-col items-center justify-between py-10 overflow-hidden">
      {/* Background Shape */}
      <span className="absolute -top-90 -right-90 w-180 h-180 rounded-full bg-white/20" />

      {/* Image - Moves between slides */}
      <div className="flex-1 flex items-center justify-center z-10">
        <img
          src={slides[current].image}
          alt=""
          className="w-100 transition-all duration-700 ease-in-out"
          // style={{ transform: `translateX(${-current * 10}%)` }}
        />
      </div>

      {/* Caption */}
      <div className="text-center px-10">
        <h1 className="text-white text-3xl font-semibold inter transition-all duration-500">
          {slides[current].title}
        </h1>
        <p className="text-white/80 mt-2 inter transition-all duration-500">
          {slides[current].description}
        </p>
      </div>

      {/* Controls - Exactly 2 arrows + 3 dots with center loader */}
      <div className="flex items-center gap-6">
        {/* Left Arrow */}
        <button
          onClick={goPrev}
          className="w-10 h-10   flex items-center justify-center text-white text-lg "
        >
          <ChevronLeft />
        </button>

        {/* Three Dots - Center has loader */}
        <div className="flex items-center gap-4">
          {/* Left Dot */}
          <button
            onClick={() => goTo(0)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === 0 
                ? "bg-white/40 hover:bg-white hover:scale-110" 
                : "bg-white/40 hover:bg-white hover:scale-110"
            }`}
          />

          {/* Center Loader Dot */}
          <svg
            className="w-6 h-6 loader-center"
            viewBox="0 0 24 24"
          >
            {/* Static track */}
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              // stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Progress arc - starts bottom, rotates clockwise */}
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="60 90"
              strokeDashoffset={calcDashOffset(progress)}
              strokeLinecap="round"
              className="transition-all duration-100 origin-center"
              style={{ transform: 'rotate(90deg)' }}
            />
            
            {/* Center dot */}
            <circle cx="12" cy="12" r="5" fill="white" />
          </svg>

          {/* Right Dot */}
          <button
            onClick={() => goTo(2)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === 2 
                ? "bg-white/40 hover:bg-white hover:scale-110" 
                : "bg-white/40 hover:bg-white hover:scale-110"
            }`}
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={goNext}
          className="w-10 h-10 flex items-center justify-center text-white text-lg "
        >
          <ChevronRight />
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .loader-center {
          /* Perfect bottom-to-start rotation */
        }
        
        @keyframes loader-full-cycle {
          0% {
            stroke-dashoffset: 62.8;
          }
          100% {
            stroke-dashoffset: -37.2;
          }
        }
      `}</style>
    </div>
  );
  // Calculate perfect dashoffset for bottom-start rotation
  function calcDashOffset(progressPercent) {
    // Full circle circumference for r=10 is ~62.8
    // Start at bottom (50%), progress 100% = full circle back to bottom
    const normalizedProgress = (progressPercent / 100) * 62.8;
    return 62.8 - normalizedProgress;
  }
}
