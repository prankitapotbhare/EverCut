import React from 'react';
import LaptopVideo from './LaptopVideo';

const VideoTutorialSection = ({ 
  videoSrc, 
  title = "Watch Our Booking Tutorial",
  subtitle = "Learn how to easily book your appointment in just a few minutes",
}) => {
  return (
    <div className="mb-16 px-4">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mt-16 mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-5">
          {title}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {subtitle}
        </p>
        
        {/* Optional decorative elements */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Video Player Container */}
      <div className="max-w-6xl mx-auto">
        <LaptopVideo src={videoSrc} />
      </div>
    </div>
  );
};

export default VideoTutorialSection;