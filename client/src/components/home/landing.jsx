import React from 'react';

const Landing = () => {
  return (
    <div
      className="relative flex items-center justify-end min-h-screen px-6 py-16 text-center 
                 bg-cover bg-center bg-no-repeat
                 bg-black sm:bg-[url('/landingm.png')] md:bg-[url('/landingl.png')] lg:bg-[url('/landingx.png')] xl:bg-[url('/landingx.png')]"
    >
      <div className="max-w-lg w-full flex flex-col lg:items-center">
        {/* Heading Section */}
        <h1 className="text-4xl font-bold text-[#06C270] mb-4">
        Evercut is Almost Here!
        </h1>
        <h2 className="text-3xl font-bold text-white mb-6">Coming soon on!</h2>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button className="bg-white text-black px-6 py-3 rounded-lg text-lg flex items-center shadow-md hover:bg-gray-200 transition">
            <img
              src="/play.svg"
              alt="Play Store"
              className="w-6 h-6 mr-2"
            />
            Play Store
          </button>
          <button className="bg-white text-black px-6 py-3 rounded-lg text-lg flex items-center shadow-md hover:bg-gray-200 transition">
            <img
              src="/app.svg"
              alt="App Store"
              className="w-6 h-6 mr-2"
            />
            App Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
