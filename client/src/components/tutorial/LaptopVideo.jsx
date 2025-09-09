import React from 'react';
import VideoPlayer from './VideoPlayer';

const LaptopVideo = ({ src, className = '' }) => {
  return (
    <div className={`relative w-full max-w-5xl mx-auto aspect-[3/2] ${className}`}>
      {/* Video positioned absolutely within the screen area */}
      <VideoPlayer 
        src={src}
        className="absolute top-[12%] left-[12%] w-[76%] h-[63%] object-cover"
      />
      {/* Laptop image on top */}
      <img 
        src="/laptop-screen.png" 
        alt="Laptop" 
        className="w-full h-full object-contain z-10" 
      />
    </div>
  );
};

export default LaptopVideo;