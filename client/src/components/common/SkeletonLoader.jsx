import React from 'react';
import PropTypes from 'prop-types';

// Base skeleton component that shows a pulsing animation
const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

Skeleton.propTypes = {
  className: PropTypes.string,
};

// Skeleton for the booking page
const BookingPageSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar placeholder - make it match the real navbar height */}
      <div className="h-16 bg-white shadow-sm"></div>
      
      <div className="max-w-8xl mx-auto py-6 px-12 transition-opacity duration-300">
        {/* Salon title and address */}
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left section - Stylist Selection */}
          <div className="md:w-1/3 pr-0 md:pr-6 mb-6 md:mb-0">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                  <Skeleton className="w-16 h-16 rounded-full mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Middle section - Date & Time Selection */}
          <div className="md:w-[40%] mb-6 md:mb-0">
            <Skeleton className="h-6 w-48 mb-4" />
            
            {/* Date Selector skeleton */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {[...Array(7)].map((_, index) => (
                  <Skeleton key={index} className="flex-shrink-0 w-16 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            
            {/* Time Selector skeleton */}
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-5 gap-2">
                {[...Array(20)].map((_, index) => (
                  <Skeleton key={index} className="h-8 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Right section - Booking Summary */}
          <div className="md:w-1/3 md:pl-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <Skeleton className="w-full h-32 rounded-lg mb-2" />
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              
              <Skeleton className="h-4 w-full mb-6" />
              
              {[...Array(3)].map((_, index) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              ))}
              
              <div className="border-t border-gray-200 mt-2 pt-3">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="w-full h-12 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer placeholder */}
      <div className="h-48 bg-gray-100 mt-12"></div>
    </div>
  );
};

export { Skeleton, BookingPageSkeleton };