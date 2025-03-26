import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { salon, services, stylist, date, time, booking } = location.state || {};

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'long' })}`;
  };

  // Calculate total amount
  const total = services?.reduce((sum, service) => sum + service.price, 0) || 0;

  if (!booking || !salon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Booking information not found</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
              <p className="text-gray-600">Your appointment has been successfully booked.</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <h2 className="text-lg font-bold mb-3">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                <p className="font-medium">{booking.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment ID</p>
                <p className="font-medium">{booking.paymentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Salon</p>
                <p className="font-medium">{salon.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Stylist</p>
                <p className="font-medium">{stylist?.name || 'Any available stylist'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="font-medium">{formatDate(date)} • {time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                <p className="font-medium">₹ {total}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Services Booked</h2>
            <div className="space-y-2">
              {services?.map((service, index) => (
                <div key={index} className="flex justify-between">
                  <span>{service.name}</span>
                  <span>₹ {service.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmationPage;