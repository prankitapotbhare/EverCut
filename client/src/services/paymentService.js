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
];

// Mock UPI IDs for testing
export const savedUpiIds = [
  { id: 'user@okicici', name: 'ICICI' },
  { id: 'user@okhdfc', name: 'HDFC' },
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
  
  console.log('Processing card payment:', { cardNumber, cardExpiry, cardCvc, cardName });
  
  // Simulate payment processing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < MOCK_SUCCESS_RATE) {
        resolve({
          success: true,
          paymentId: 'pi_' + Math.random().toString(36).substring(2, 15),
          last4: cardNumber.slice(-4),
          message: 'Payment successful',
        });
      } else {
        reject({
          success: false,
          error: 'Payment failed',
          message: 'Your card was declined. Please try another payment method.',
        });
      }
    }, MOCK_PAYMENT_DELAY);
  });
};

// Process a UPI payment
const processUpiPayment = async (upiId) => {
  console.log('Processing UPI payment:', upiId);
  
  // Simulate payment processing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < MOCK_SUCCESS_RATE) {
        resolve({
          success: true,
          paymentId: 'pi_' + Math.random().toString(36).substring(2, 15),
          upiId,
          message: 'Payment successful',
        });
      } else {
        reject({
          success: false,
          error: 'Payment failed',
          message: 'UPI payment failed. Please try another payment method.',
        });
      }
    }, MOCK_PAYMENT_DELAY);
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

export const paymentService = {
  stripePromise,
  createPaymentIntent,
  processCardPayment,
  processUpiPayment,
  createBookingWithPayment,
  savedPaymentMethods,
  savedUpiIds,
};