import React, { useState, useEffect } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import CardPaymentForm from './CardPaymentForm';
import UpiPaymentForm from './UpiPaymentForm';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailure from './PaymentFailure';

const PaymentModal = ({ isOpen, onClose, bookingDetails }) => {
  const {
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    isProcessing,
    error,
    transactionDetails,
    handlePayment,
    resetPaymentState,
  } = usePayment();

  useEffect(() => {
    if (isOpen) {
      resetPaymentState();
    }
  }, [isOpen, resetPaymentState]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentSubmit = async (details) => {
    try {
      await handlePayment(details, bookingDetails);
    } catch (error) {
      console.error('Payment processing error:', error);
    }
  };

  const handleCancel = () => {
    resetPaymentState();
    onClose();
  };

  if (!isOpen) return null;

  const total = bookingDetails?.services?.reduce((sum, service) => sum + service.price, 0) || 0;

  let content;
  if (paymentStatus === 'success') {
    content = <PaymentSuccess onClose={onClose} bookingDetails={bookingDetails} />;
  } else if (paymentStatus === 'failed') {
    content = <PaymentFailure onClose={resetPaymentState} error={error} />;
  } else {
    content = (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment</h2>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Payment Method Selection */}
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <div 
              className={`flex-1 p-3 border rounded-lg flex items-center cursor-pointer ${paymentMethod === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
              onClick={() => handlePaymentMethodChange('upi')}
            >
              <input 
                type="radio" 
                checked={paymentMethod === 'upi'} 
                onChange={() => handlePaymentMethodChange('upi')} 
                className="mr-2"
              />
              <img src="/UPI.png" alt="UPI" className="h-6" />
            </div>
            <div 
              className={`flex-1 p-3 border rounded-lg flex items-center cursor-pointer ${paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
              onClick={() => handlePaymentMethodChange('card')}
            >
              <input 
                type="radio" 
                checked={paymentMethod === 'card'} 
                onChange={() => handlePaymentMethodChange('card')} 
                className="mr-2"
              />
              <img src="/card.png" alt="Card" className="h-6" />
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'card' ? (
            <CardPaymentForm onSubmit={handlePaymentSubmit} loading={isProcessing} />
          ) : (
            <UpiPaymentForm onSubmit={handlePaymentSubmit} loading={isProcessing} />
          )}

          {/* Total Amount and Cancel Button */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-bold">₹ {total}</span>
            </div>
            
            {/* Cancel Payment Button */}
            <button
              onClick={handleCancel}
              className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
              disabled={isProcessing}
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      {content}
    </div>
  );
};

export default PaymentModal;