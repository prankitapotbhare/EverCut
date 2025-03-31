import React from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = ({ onClose, bookingDetails }) => {
  const { bookingResult } = usePayment();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'long' })}`;
  };

  // Calculate total amount
  const total = bookingDetails?.services?.reduce((sum, service) => sum + service.price, 0) || 0;

  const handleBackToHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      {/* Success Header with Animation */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-center">Booking Confirmed!</h1>
        <p className="text-gray-600 text-center">Your appointment has been successfully booked.</p>
      </div>

      {/* Simplified Booking Details */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Salon</span>
            <span className="font-medium">{bookingDetails?.salon?.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-medium">{formatDate(bookingDetails?.date)} • {bookingDetails?.time}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-bold text-green-600">₹ {total}</span>
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="flex justify-center">
        <button 
          onClick={handleBackToHome}
          className="bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;