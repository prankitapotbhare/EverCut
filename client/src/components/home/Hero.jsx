import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Adjust scaling based on screen size
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.85, 1] : [1.1, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.div
      className="relative h-auto w-full flex flex-col items-center justify-center text-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      variants={gradientVariants}
      animate="animate"
      ref={containerRef}
      style={{
        background: "radial-gradient(circle, #D8AFFF, #D8D4FF, #FFEF99)", // ✅ Background only for the section
        backgroundSize: "200% 200%",
      }}
    >
      {/* Content Section */}
      <div className="relative z-10">
        {/* Heading */}
        <h1 className="py-10 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-10 mb-4 text-black max-w-md md:max-w-xl lg:max-w-2xl text-center mx-auto">
        We’re here to bring out your best <span className="text-[#06C270]">look.</span>
        </h1>

        {/* App Store Badges */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-12 items-center justify-center w-full">
          <a className="block">
            <div className="h-12 md:h-14 w-36 md:w-40 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer">
              <span className="text-white text-sm md:text-base inline-flex items-center justify-center gap-2">
                <img src="/play.svg" alt="Play Store" className="w-8 h-8 md:w-9 md:h-9 cursor-pointer" />
                Play Store
              </span>
            </div>
          </a>

          <a className="block">
            <div className="h-12 md:h-14 w-36 md:w-40 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer">
              <span className="text-white text-sm md:text-base inline-flex items-center gap-2">
                <img src="/app.svg" alt="App Store" className="w-8 h-8 md:w-9 md:h-9 " />
                App Store
              </span>
            </div>
          </a>
        </div>

        {/* 🔥 Animated Main Image with scrolling effect */}
        <motion.div
          className="w-full flex justify-center mt-20"
          style={{
            rotateX: rotate,
            scale: scale,
            translateY: translate,
          }}
        >
          <img 
            src="https://i.imgur.com/VRomEAi.png" 
            alt="main image" 
            className="mx-auto object-contain w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-transparent lg:pl-4 md:pl-2 sm:pl-2"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
