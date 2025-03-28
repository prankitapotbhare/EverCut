import React from 'react';
import { usePayment } from '@/contexts/PaymentContext';

const PaymentFailure = ({ onClose, error }) => {
  const { resetPaymentState } = usePayment();

  const handleTryAgain = () => {
    resetPaymentState();
    if (onClose) onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Failed!</h2>
        <p className="text-gray-600 mb-4">
          Your transaction has failed due to<br />
          some technical error. Please try again.
        </p>
        
        {error && (
          <div className="text-left bg-red-50 p-4 rounded-lg mb-4 text-red-700">
            <div className="font-medium mb-1">Error Details</div>
            <div className="text-sm">{error.message || 'Unknown error occurred'}</div>
          </div>
        )}
        
        <button
          onClick={handleTryAgain}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;