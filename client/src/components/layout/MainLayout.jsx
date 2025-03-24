import React from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const MainLayout = ({ children, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;