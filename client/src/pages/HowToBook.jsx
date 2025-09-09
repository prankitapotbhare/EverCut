import React from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import SalonFinder from '@/components/salon/SalonFinder';
import VideoPlayer from '@/components/common/VideoPlayer';

const HowToBook = () => {
  return (
    <div>
      <Navbar />
      <div>
        <SalonFinder />

        <div className="mt-12 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to book your perfect salon appointment
          </p>
        </div>
        
        {/* Video Tutorial Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Watch Our Booking Tutorial
            </h2>
            <p className="text-gray-600">
              Learn how to easily book your appointment in just a few minutes
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              width="100%"
              height="400px"
              controls={true}
              className="shadow-lg"
              onPlay={() => console.log('Video started playing')}
              onPause={() => console.log('Video paused')}
              onEnded={() => console.log('Video ended')}
            />
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default HowToBook;