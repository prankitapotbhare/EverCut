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
            <p className="font-medium">{bookingResult?.bookingId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment ID</p>
            <p className="font-medium">{bookingResult?.paymentId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Salon</p>
            <p className="font-medium">{bookingDetails?.salon?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Stylist</p>
            <p className="font-medium">{bookingDetails?.stylist?.name || 'Any available stylist'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Date & Time</p>
            <p className="font-medium">{formatDate(bookingDetails?.date)} • {bookingDetails?.time}</p>
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
          {bookingDetails?.services?.map((service, index) => (
            <div key={index} className="flex justify-between">
              <span>{service.name}</span>
              <span>₹ {service.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleBackToHome}
          className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;