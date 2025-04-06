const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'inr',
    required: true,
    enum: ['inr', 'usd', 'eur', 'gbp']
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cash'],
    required: true
  },
  paymentDetails: {
    // For card payments
    cardId: String,
    brand: String,
    last4: String,
    expiryMonth: Number,
    expiryYear: Number,
    cardholderName: String,
    
    // For UPI payments
    upiId: String,
    provider: String,
    reference: String,
    
    // For other payment methods
    transactionId: String,
    gateway: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
    index: true
  },
  receiptId: {
    type: String,
    unique: true,
    sparse: true
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundReason: {
    type: String
  },
  refundDate: {
    type: Date
  },
  error: {
    code: String,
    message: String
  },
  gatewayResponse: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound indexes for efficient querying
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ bookingId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);