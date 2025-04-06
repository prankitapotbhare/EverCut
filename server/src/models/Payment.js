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
    required: true
  },
  currency: {
    type: String,
    default: 'inr',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi'],
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
    reference: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
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
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  error: {
    code: String,
    message: String
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

module.exports = mongoose.model('Payment', paymentSchema);