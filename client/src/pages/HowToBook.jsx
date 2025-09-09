import React from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import SalonFinder from '@/components/salon/SalonFinder';
import VideoTutorialSection from '@/components/tutorial/VideoTutorialSection';

const HowToBookPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section with Search */}
      <SalonFinder />
      
      {/* Video Tutorial Section with Laptop Display */}
      {/* <VideoTutorialSection
        videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        title="How to Book Your Perfect Appointment"
        subtitle="Follow our video tutorial guide to booking salon appointments with confidence. 
                  From finding the right salon to securing your preferred time slot, we've got you covered."
      /> */}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HowToBookPage;