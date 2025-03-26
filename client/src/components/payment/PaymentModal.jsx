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

  // Reset payment state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      resetPaymentState();
    }
  }, [isOpen, resetPaymentState]);

  // No need for the effect to automatically close the modal
  // Let the user close it when they're ready

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

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Calculate total amount
  const total = bookingDetails?.services?.reduce((sum, service) => sum + service.price, 0) || 0;

  // Render appropriate content based on payment state
  let content;
  if (paymentStatus === 'success') {
    content = <PaymentSuccess onClose={onClose} bookingDetails={bookingDetails} />;
  } else if (paymentStatus === 'failed') {
    content = <PaymentFailure onClose={resetPaymentState} error={error} />;
  } else {
    content = (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
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

          {/* Total Amount */}
          <div className="flex justify-between items-center mt-6">
            <span className="font-medium">Total:</span>
            <span className="font-bold">₹ {total}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-[90%] flex items-center justify-center z-50 p-4">
      {content}
    </div>
  );
};

export default PaymentModal;