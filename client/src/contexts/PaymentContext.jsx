import React, { createContext, useContext, useState, useCallback } from 'react';
import { paymentService, savedPaymentMethods, savedUpiIds } from '@/services/paymentService';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'failed'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Reset payment state
  const resetPaymentState = useCallback(() => {
    setPaymentStatus(null);
    setError(null);
    setTransactionDetails(null);
    setBookingResult(null);
    setIsProcessing(false);
  }, []);

  // Load transaction history
  const loadTransactionHistory = useCallback(async () => {
    try {
      const history = await paymentService.transactionHistory;
      setTransactionHistory(history);
      return history;
    } catch (error) {
      console.error('Error loading transaction history:', error);
      return [];
    }
  }, []);

  // Handle payment
  const handlePayment = useCallback(async (paymentDetails, bookingDetails) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Process payment based on method
      const paymentResult = await (paymentMethod === 'card' 
        ? paymentService.processCardPayment(paymentDetails)
        : paymentService.processUpiPayment(paymentDetails.upiId));
      
      setTransactionDetails(paymentResult);
      
      // If booking details are provided, create a booking
      if (bookingDetails) {
        const booking = await paymentService.createBookingWithPayment(bookingDetails, paymentResult);
        setBookingResult(booking);
      }
      
      setPaymentStatus('success');
      return paymentResult;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error);
      setPaymentStatus('failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethod]);

  // Verify payment
  const verifyPayment = useCallback(async (paymentId) => {
    try {
      return await paymentService.verifyPayment(paymentId);
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }, []);

  // Get payment receipt
  const getPaymentReceipt = useCallback(async (paymentId) => {
    try {
      return await paymentService.getPaymentReceipt(paymentId);
    } catch (error) {
      console.error('Receipt generation error:', error);
      throw error;
    }
  }, []);

  const value = {
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    isProcessing,
    error,
    transactionDetails,
    bookingResult,
    transactionHistory,
    handlePayment,
    verifyPayment,
    getPaymentReceipt,
    resetPaymentState,
    loadTransactionHistory,
    savedPaymentMethods,
    savedUpiIds
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};