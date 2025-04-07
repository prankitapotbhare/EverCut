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

// Mock function to generate invoice PDF
// Add this to the paymentService object
export const paymentService = {
  stripePromise,
  createPaymentIntent,
  processCardPayment,
  processUpiPayment,
  verifyPayment,
  createBookingWithPayment,
  // Generate and download invoice PDF
  getPaymentReceipt: async (paymentId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, MOCK_PAYMENT_DELAY));
    
    // Mock invoice data that matches the image
    return {
      success: true,
      paymentId,
      invoiceData: {
        salonName: 'Kiran Salon',
        salonAddress: 'Company address',
        salonLocation: 'City, Country - 00000',
        salonPhone: '+0 (000) 123-4567',
        appointmentDate: '01.08.2023',
        amount: 170,
        services: [
          { title: 'Hair Cut', price: 80 },
          { title: 'Beard', price: 90 }
        ]
      }
    };
  },
  
  // Download invoice as PDF
  downloadInvoice: async (paymentId, customInvoiceData = null) => {
    try {
      // If custom invoice data is provided, use it
      // Otherwise, get the receipt data from the service
      let invoiceData;
      
      if (customInvoiceData) {
        invoiceData = customInvoiceData;
      } else {
        const receiptData = await paymentService.getPaymentReceipt(paymentId);
        
        if (!receiptData.success) {
          throw new Error('Failed to get receipt data');
        }
        
        invoiceData = receiptData.invoiceData;
      }
      
      // Generate PDF using the invoice template
      const pdf = await generateInvoicePdf(invoiceData);
      
      // Save the PDF
      pdf.save(`evercut-invoice-${paymentId}.pdf`);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading invoice:', error);
      return { success: false, error: error.message };
    }
  },
  savedPaymentMethods,
  savedUpiIds,
  transactionHistory,
};

// Import the necessary libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Function to generate the invoice PDF
const generateInvoicePdf = async (invoiceData) => {
  // Create a temporary div to render the invoice
  const invoiceContainer = document.createElement('div');
  invoiceContainer.style.width = '595px'; // A4 width in pixels at 72 DPI
  invoiceContainer.style.padding = '40px';
  invoiceContainer.style.fontFamily = 'Arial, sans-serif';
  invoiceContainer.style.position = 'absolute';
  invoiceContainer.style.left = '-9999px';
  
  // Add the invoice HTML content
  invoiceContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
      <div>
        <img src="/logo/evercut.png" alt="EverCut" style="height: 30px; margin-bottom: 10px;" />
      </div>
      <div style="text-align: right; color: #aaa; font-size: 32px; font-weight: 300;">
        Invoice
      </div>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
      <div>
        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">SALON INFO</div>
        <div style="font-weight: bold; margin-bottom: 5px;">${invoiceData.salonName}</div>
        <div style="font-size: 14px; color: #666;">${invoiceData.salonAddress}</div>
        <div style="font-size: 14px; color: #666;">${invoiceData.salonLocation}</div>
        <div style="font-size: 14px; color: #666;">${invoiceData.salonPhone}</div>
      </div>
      
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">APPOINTMENT DATE</div>
        <div style="font-size: 14px;">${invoiceData.appointmentDate}</div>
      </div>
      
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">AMOUNT DUE</div>
        <div style="background-color: #f0ff7a; padding: 5px 15px; font-size: 16px; font-weight: bold;">₹ ${invoiceData.amount}</div>
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Services</div>
      
      <div style="display: flex; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">
        <div style="width: 5%; font-size: 14px; color: #666;">#</div>
        <div style="width: 75%; font-size: 14px; color: #666;">TITLE / DESCRIPTION</div>
        <div style="width: 20%; text-align: right; font-size: 14px; color: #666;">SUBTOTAL</div>
      </div>
      
      ${invoiceData.services.map((service, index) => `
        <div style="display: flex; padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
          <div style="width: 5%;">${index + 1}</div>
          <div style="width: 75%;">${service.title}</div>
          <div style="width: 20%; text-align: right;">₹${service.price}</div>
        </div>
      `).join('')}
      
      <div style="display: flex; padding: 15px 0; font-weight: bold;">
        <div style="width: 5%;"></div>
        <div style="width: 75%;">Total</div>
        <div style="width: 20%; text-align: right;">₹ ${invoiceData.amount}</div>
      </div>
    </div>
    
    <div style="margin-top: 100px; text-align: left; color: #666;">
      Thank you for the Appointment
    </div>
  `;
  
  // Append to body temporarily
  document.body.appendChild(invoiceContainer);
  
  try {
    // Convert the HTML to canvas
    const canvas = await html2canvas(invoiceContainer, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false
    });
    
    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    const imgWidth = 595; // A4 width in points
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    return pdf;
  } finally {
    // Clean up
    document.body.removeChild(invoiceContainer);
  }
};