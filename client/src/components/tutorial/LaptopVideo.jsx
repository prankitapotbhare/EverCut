import React from 'react';
import VideoPlayer from './VideoPlayer';

const LaptopVideo = ({ 
  src, 
  className = '', 
  controls = true,
  autoPlay = true,
  loop = true,
  muted = false,
  preload = 'metadata'
}) => {
  return (
    <div className={`relative w-full max-w-2xl mx-auto aspect-[16/9] ${className}`}>
      {/* Video positioned absolutely within the screen area */}
      <VideoPlayer 
        src={src}
        className="absolute object-cover top-[5.2%] left-[12%] w-[76%] h-[74%] opacity-100"
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        preload={preload}
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