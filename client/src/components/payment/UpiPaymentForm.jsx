import React, { useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';

const UpiPaymentForm = ({ onSubmit, loading }) => {
  const { savedUpiIds } = usePayment();
  const [upiId, setUpiId] = useState('');
  const [showSavedUpi, setShowSavedUpi] = useState(false);

  const handleChange = (e) => {
    setUpiId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ upiId, method: 'upi' });
  };

  const handleSavedUpiSelect = (savedUpi) => {
    setUpiId(savedUpi.id);
    setShowSavedUpi(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-xs uppercase font-medium text-gray-700 mb-1">
          UPI ID
        </label>
        <div className="relative">
          <input
            type="text"
            name="upiId"
            value={upiId}
            onChange={handleChange}
            placeholder="name@upi"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
          {savedUpiIds.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSavedUpi(!showSavedUpi)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          )}
        </div>
        
        {/* Saved UPI dropdown */}
        {showSavedUpi && savedUpiIds.length > 0 && (
          <div className="mt-1 border border-gray-200 rounded-md shadow-sm bg-white">
            {savedUpiIds.map((savedUpi, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSavedUpiSelect(savedUpi)}
              >
                <div className="flex items-center">
                  <span className="font-medium">{savedUpi.id}</span>
                  <span className="ml-2 text-xs text-gray-500">({savedUpi.name})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center ">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Pay'
        )}
      </button>
    </form>
  );
};

export default UpiPaymentForm;