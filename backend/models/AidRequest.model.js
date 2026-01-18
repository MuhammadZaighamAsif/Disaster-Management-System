const mongoose = require('mongoose');

const aidRequestSchema = new mongoose.Schema(
  {
    victim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    disaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disaster',
    },
    aidType: {
      type: String,
      enum: ['FOOD', 'CLOTHES', 'SHELTER', 'MEDICAL'],
      required: [true, 'Aid type is required'],
      uppercase: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    familySize: {
      type: Number,
      required: [true, 'Family size is required'],
      min: [1, 'Family size must be at least 1'],
    },
    childrenCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    eldersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    specialNeeds: {
      type: String,
      trim: true,
      maxlength: [500, 'Special needs cannot exceed 500 characters'],
    },
    urgency: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'APPROVED', 'ALLOCATED', 'DELIVERED', 'RECEIVED', 'REJECTED'],
      default: 'PENDING',
      uppercase: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    exceedsLimit: {
      type: Boolean,
      default: false,
    },
    systemLimit: {
      type: Number,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    deliveredAt: {
      type: Date,
    },
    receivedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
aidRequestSchema.index({ victim: 1, status: 1 });
aidRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('AidRequest', aidRequestSchema);
