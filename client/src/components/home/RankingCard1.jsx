import React from "react";

const RankingCard1 = () => {
  return (
    <section className="bg-gray-50 py-12 px-6 md:px-16 flex flex-col md:flex-row items-center gap-12">
      
      {/* Left Side - Image */}
      <div className="flex-1 flex justify-center h-full ">
        <img src="https://i.imgur.com/jMR0mEO.jpg" alt="Evercut Barber Experience" className="w-full h-auto max-h-[700px] md:max-h-full rounded-3xl object-cover" />
      </div>

      {/* Right Side - Text Content */}
      <div className="flex-1">
        <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
           For Barbers
        </span>
        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          <span className="text-[#06C270]">Evercut</span> - The Ultimate Barber Booking Solution
        </h2>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Evercut empowers barbers with an advanced appointment scheduling system,
          ensuring a seamless and efficient experience for both barbers and clients.
        </p>
        <ul className="mt-8 text-gray-700 space-y-2">
          <li>💈 Effortless Appointment Management</li>
          <li>📆 Real-Time Schedule Updates</li>
          <li>🖥️ Intuitive Barber Dashboard</li>
          <li>📢 Expand Your Client Base</li>
        </ul>
      </div>

    </section>
  );
};

export default RankingCard1;
