const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
  salonistId: {
    type: Schema.Types.ObjectId,
    ref: 'Salonist',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['FULL_DAY', 'PARTIAL_DAY'],
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: function() {
      return this.type === 'FULL_DAY';
    },
    index: true
  },
  date: {
    type: Date,
    required: function() {
      return this.type === 'PARTIAL_DAY';
    }
  },
  startTime: {
    type: String,
    required: function() {
      return this.type === 'PARTIAL_DAY';
    }
  },
  endTime: {
    type: String,
    required: function() {
      return this.type === 'PARTIAL_DAY';
    }
  },
  reason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
leaveSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for efficient querying
leaveSchema.index({ salonistId: 1, startDate: 1 });
leaveSchema.index({ salonistId: 1, endDate: 1 });
leaveSchema.index({ salonistId: 1, date: 1 });

module.exports = mongoose.model('Leave', leaveSchema);