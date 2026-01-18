const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Disaster name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: ['EARTHQUAKE', 'FLOOD', 'FIRE', 'HURRICANE', 'TORNADO', 'LANDSLIDE', 'TSUNAMI', 'OTHER'],
      required: [true, 'Disaster type is required'],
      uppercase: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    areaCode: {
      type: String,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
      uppercase: true,
      index: true,
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
    affectedAreas: {
      type: String,
      trim: true,
    },
    estimatedVictims: {
      type: Number,
      min: 0,
    },
    requiredResources: {
      type: String,
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
disasterSchema.index({ name: 'text', location: 'text', city: 'text' });

module.exports = mongoose.model('Disaster', disasterSchema);
