import React, { createContext, useContext, useState } from 'react';
import { paymentService } from '@/services/paymentService';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  // Reset payment state
  const resetPaymentState = () => {
    setLoading(false);
    setError(null);
    setPaymentSuccess(false);
    setPaymentResult(null);
    setBookingResult(null);
  };

  // Process payment based on selected method
  const processPayment = async (paymentDetails, bookingDetails) => {
    setLoading(true);
    setError(null);
    setPaymentSuccess(false);
    setPaymentResult(null);
    setBookingResult(null);

    try {
      let result;

      if (paymentMethod === 'card') {
        result = await paymentService.processCardPayment(paymentDetails);
      } else if (paymentMethod === 'upi') {
        result = await paymentService.processUpiPayment(paymentDetails.upiId);
      } else {
        throw new Error('Invalid payment method');
      }

      setPaymentResult(result);
      setPaymentSuccess(true);

      // Create booking with payment
      const booking = await paymentService.createBookingWithPayment(bookingDetails, result);
      setBookingResult(booking);

      return { paymentResult: result, bookingResult: booking };
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    paymentMethod,
    setPaymentMethod,
    loading,
    error,
    paymentSuccess,
    paymentResult,
    bookingResult,
    processPayment,
    resetPaymentState,
    savedPaymentMethods: paymentService.savedPaymentMethods,
    savedUpiIds: paymentService.savedUpiIds,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};