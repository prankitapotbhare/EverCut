import React from 'react';

const FeaturesComponent = () => {
  return (
    <section className="bg-gray-50 py-12 px-6 md:px-16 lg:px-24">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
          Explore <span className="text-green-600">Evercut's</span> Powerful Features
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Unlock the full potential of Evercut with a suite of advanced features designed to deliver fast, accurate bookings and enhance your salon experience.
        </p>
      </div>

      {/* Feature Icons */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <div className="flex items-center space-x-2 p-4 bg-white shadow-md rounded-lg">
          <span className="text-gray-700 text-lg">💈 Easy Booking</span>
        </div>
        <div className="flex items-center space-x-2 p-4 bg-white shadow-md rounded-lg">
          <span className="text-gray-700 text-lg">📅 Real-time Schedule</span>
        </div>
        <div className="flex items-center space-x-2 p-4 bg-white shadow-md rounded-lg">
          <span className="text-gray-700 text-lg">⭐ Reviews & Ratings</span>
        </div>
        <div className="flex items-center space-x-2 p-4 bg-white shadow-md rounded-lg">
          <span className="text-gray-700 text-lg">📱 Mobile App</span>
        </div>
      </div>

      {/* Category Section */}
      <div className="mt-12 bg-green-100 rounded-xl p-6 md:p-10">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Service Categories</h3>
        <p className="text-gray-600 mt-2">
          Evercut offers a wide range of salon services including haircuts, styling, coloring, and more. Choose from our comprehensive list of services and find the perfect style that matches your preferences.
        </p>

        {/* Mockup with Categories */}
        <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src="/v1.png"
            alt="Evercut App Mockup"
            className="w-[300px] h-[200px] object-cover rounded-lg shadow-lg"
          />
          <div className="bg-white p-4 shadow-lg rounded-lg w-full max-w-md">
            <h4 className="font-medium text-gray-800">Popular Services</h4>
            <div className="mt-2">
              <p className="text-gray-700 font-semibold">✂️ Haircut & Styling</p>
              <p className="text-sm text-gray-500">Professional cuts and styling for all hair types.</p>
            </div>
            <div className="mt-2">
              <p className="text-gray-700 font-semibold">🎨 Color & Highlights</p>
              <p className="text-sm text-gray-500">Expert coloring services for a fresh new look.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesComponent;
