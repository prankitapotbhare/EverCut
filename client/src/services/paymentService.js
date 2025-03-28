// Payment service for handling Stripe integration and payment processing
import { loadStripe } from '@stripe/stripe-js';

// Mock API for payment processing
const MOCK_PAYMENT_DELAY = 1500; // Simulate network delay
const MOCK_SUCCESS_RATE = 0.8; // 80% success rate for testing

// Initialize Stripe (in a real app, use your publishable key from environment variables)
const stripePromise = loadStripe('pk_test_mock_key');

// Mock payment methods data
export const savedPaymentMethods = [
  {
    id: 'pm_1234567890',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2025,
    },
    billing_details: {
      name: 'John Doe',
    },
  },
  {
    id: 'pm_0987654321',
    type: 'card',
    card: {
      brand: 'mastercard',
      last4: '1111',
      exp_month: 10,
      exp_year: 2024,
    },
    billing_details: {
      name: 'Jane Smith',
    },
  },
];

// Mock UPI IDs for testing
export const savedUpiIds = [
  { id: 'user@okicici', name: 'ICICI' },
  { id: 'user@okhdfc', name: 'HDFC' },
  { id: 'user@oksbi', name: 'SBI' },
  { id: 'user@okaxis', name: 'Axis' },
];

// Mock transaction history
export const transactionHistory = [
  {
    id: 'txn_123456',
    amount: 1200,
    currency: 'inr',
    status: 'succeeded',
    payment_method: 'card',
    card_details: {
      brand: 'visa',
      last4: '4242',
    },
    created_at: '2023-05-15T10:30:00Z',
  },
  {
    id: 'txn_789012',
    amount: 800,
    currency: 'inr',
    status: 'succeeded',
    payment_method: 'upi',
    upi_id: 'user@okicici',
    created_at: '2023-05-10T14:45:00Z',
  },
  {
    id: 'txn_345678',
    amount: 1500,
    currency: 'inr',
    status: 'failed',
    payment_method: 'card',
    card_details: {
      brand: 'mastercard',
      last4: '5678',
    },
    error: 'insufficient_funds',
    created_at: '2023-05-05T09:15:00Z',
  },
];

// Create a payment intent (in a real app, this would call your backend)
const createPaymentIntent = async (amount, currency = 'inr') => {
  console.log(`Creating payment intent for ${amount} ${currency}`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        clientSecret: 'mock_client_secret_' + Math.random().toString(36).substring(2, 15),
        amount,
        currency,
      });
    }, MOCK_PAYMENT_DELAY);
  });
};

// Process a card payment
const processCardPayment = async (paymentDetails) => {
  const { cardNumber, cardExpiry, cardCvc, cardName } = paymentDetails;
  
  console.log('Processing card payment:', { 
    cardNumber: cardNumber ? `${cardNumber.substring(0, 4)}...${cardNumber.slice(-4)}` : 'N/A', 
    cardExpiry, 
    cardCvc: cardCvc ? '***' : 'N/A', 
    cardName 
  });
  
  // Validate card details (basic validation)
  if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
    return Promise.reject({
      success: false,
      error: 'invalid_details',
      message: 'Please provide all required card details.',
    });
  }
  
  // Simulate specific card number failures for testing
  if (cardNumber.endsWith('0000')) {
    return Promise.reject({
      success: false,
      error: 'card_declined',
      message: 'Your card was declined. Please try another payment method.',
    });
  }
  
  if (cardNumber.endsWith('1111')) {
    return Promise.reject({
      success: false,
      error: 'insufficient_funds',
      message: 'Your card has insufficient funds.',
    });
  }
  
  // Simulate payment processing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < MOCK_SUCCESS_RATE) {
        resolve({
          success: true,
          paymentId: 'pi_' + Math.random().toString(36).substring(2, 15),
          last4: cardNumber.slice(-4),
          brand: getCardBrand(cardNumber),
          amount: paymentDetails.amount || 1000,
          currency: 'inr',
          message: 'Payment successful',
          timestamp: new Date().toISOString(),
        });
      } else {
        reject({
          success: false,
          error: 'payment_failed',
          message: 'Your card was declined. Please try another payment method.',
          timestamp: new Date().toISOString(),
        });
      }
    }, MOCK_PAYMENT_DELAY);
  });
};

// Helper function to determine card brand from number
const getCardBrand = (cardNumber) => {
  const firstDigit = cardNumber.charAt(0);
  const firstTwoDigits = cardNumber.substring(0, 2);
  
  if (firstDigit === '4') return 'visa';
  if (firstTwoDigits >= '51' && firstTwoDigits <= '55') return 'mastercard';
  if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'amex';
  if (firstTwoDigits === '62') return 'unionpay';
  return 'unknown';
};

// Process a UPI payment
const processUpiPayment = async (upiId) => {
  console.log('Processing UPI payment:', upiId);
  
  // Validate UPI ID (basic validation)
  if (!upiId || !upiId.includes('@')) {
    return Promise.reject({
      success: false,
      error: 'invalid_upi',
      message: 'Please provide a valid UPI ID.',
    });
  }
  
  // Simulate specific UPI failures for testing
  if (upiId.includes('fail')) {
    return Promise.reject({
      success: false,
      error: 'upi_declined',
      message: 'UPI payment failed. Please try another UPI ID.',
    });
  }
  
  if (upiId.includes('timeout')) {
    return Promise.reject({
      success: false,
      error: 'timeout',
      message: 'UPI payment timed out. Please try again.',
    });
  }
  
  // Simulate payment processing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < MOCK_SUCCESS_RATE) {
        resolve({
          success: true,
          paymentId: 'upi_' + Math.random().toString(36).substring(2, 15),
          upiId,
          provider: upiId.split('@')[1],
          amount: 1000, // Default amount
          currency: 'inr',
          message: 'Payment successful',
          timestamp: new Date().toISOString(),
          reference: 'REF' + Math.floor(Math.random() * 1000000),
        });
      } else {
        reject({
          success: false,
          error: 'payment_failed',
          message: 'UPI payment failed. Please try another payment method.',
          timestamp: new Date().toISOString(),
        });
      }
    }, MOCK_PAYMENT_DELAY);
  });
};

// Verify payment status
const verifyPayment = async (paymentId) => {
  console.log('Verifying payment:', paymentId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verified: true,
        paymentId,
        status: 'succeeded',
        timestamp: new Date().toISOString(),
      });
    }, MOCK_PAYMENT_DELAY / 2);
  });
};

// Create a booking with payment
const createBookingWithPayment = async (bookingDetails, paymentResult) => {
  console.log('Creating booking with payment:', { bookingDetails, paymentResult });
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bookingId: 'bk_' + Math.random().toString(36).substring(2, 15),
        salon: bookingDetails.salon,
        services: bookingDetails.services,
        stylist: bookingDetails.stylist,
        date: bookingDetails.date,
        time: bookingDetails.time,
        paymentId: paymentResult.paymentId,
        amount: bookingDetails.services.reduce((sum, service) => sum + service.price, 0),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      });
    }, MOCK_PAYMENT_DELAY / 2);
  });
};

// Get payment receipt
const getPaymentReceipt = async (paymentId) => {
  console.log('Generating receipt for payment:', paymentId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        receiptId: 'rcpt_' + Math.random().toString(36).substring(2, 15),
        paymentId,
        amount: 1000,
        currency: 'inr',
        timestamp: new Date().toISOString(),
        customerName: 'John Doe',
        services: ['Haircut', 'Styling'],
        taxAmount: 180,
        totalAmount: 1180,
        pdfUrl: 'https://example.com/receipts/mock-receipt.pdf',
      });
    }, MOCK_PAYMENT_DELAY / 2);
  });
};

export const paymentService = {
  stripePromise,
  createPaymentIntent,
  processCardPayment,
  processUpiPayment,
  verifyPayment,
  createBookingWithPayment,
  getPaymentReceipt,
  savedPaymentMethods,
  savedUpiIds,
  transactionHistory,
};