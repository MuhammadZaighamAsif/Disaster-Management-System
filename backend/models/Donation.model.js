const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['MONEY', 'ITEMS', 'SHELTER'],
      required: [true, 'Donation type is required'],
      uppercase: true,
    },
    disaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disaster',
    },
    donationType: {
      type: String,
      enum: ['GENERAL', 'SPECIFIC'],
      default: 'GENERAL',
      uppercase: true,
    },
    // Money donation fields
    amount: {
      type: Number,
      min: 0,
    },
    // Item donation fields
    itemType: {
      type: String,
      enum: ['FOOD', 'CLOTHES', 'MEDICAL', 'SHELTER_MATERIALS', 'OTHER'],
      uppercase: true,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'APPROVED', 'RECEIVED', 'ALLOCATED', 'REJECTED'],
      default: 'VERIFIED',
      uppercase: true,
      index: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    dropoffAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ status: 1, type: 1 });

module.exports = mongoose.model('Donation', donationSchema);
