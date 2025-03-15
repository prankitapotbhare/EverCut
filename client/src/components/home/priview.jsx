import React from "react";

const RankingCard = () => {
  return (
    <section className="bg-gray-50 py-12 px-6 md:px-16 flex flex-col md:flex-row items-center gap-12">
      {/* Left Side - Text Content */}
      <div className="flex-1">
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
           For Users
        </span>
        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          <span className="text-blue-600">Evercut</span> - The Future of Salon Bookings
        </h2>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Evercut revolutionizes the way users book salon appointments by offering a seamless,
          AI-powered booking experience with real-time availability and smart recommendations.
        </p>
        <ul className="mt-8 text-gray-700 space-y-2">
          <li>✅ Hassle-Free Appointments</li>
          <li>⚡ Instant Booking Confirmation</li>
          <li>🎨 Smart & Intuitive Interface</li>
          <li>🌍 Your Go-To Salon Booking Solution</li>
        </ul>
      </div>

      {/* Right Side - Image Placeholder */}
      <div className="flex-1 flex justify-center h-full">
        <img src="/v2.png" alt="Evercut User Experience" className="w-full h-auto max-h-[700px] md:max-h-full rounded-3xl object-cover" />
      </div>
    </section>
  );
};

export default RankingCard;
