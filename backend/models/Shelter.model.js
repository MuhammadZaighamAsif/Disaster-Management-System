const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    disaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disaster',
      required: true,
    },
    shelterName: {
      type: String,
      required: [true, 'Shelter name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    bedsAvailable: {
      type: Number,
      required: [true, 'Number of beds is required'],
      min: [1, 'At least 1 bed must be available'],
    },
    bedsOccupied: {
      type: Number,
      default: 0,
      min: 0,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: [500, 'Additional info cannot exceed 500 characters'],
    },
    facilities: {
      hasElectricity: { type: Boolean, default: false },
      hasWater: { type: Boolean, default: false },
      hasFood: { type: Boolean, default: false },
      hasMedical: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'FULL', 'INACTIVE'],
      default: 'AVAILABLE',
      uppercase: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate available beds
shelterSchema.virtual('availableBeds').get(function () {
  return this.bedsAvailable - this.bedsOccupied;
});

// Update status based on occupancy
shelterSchema.pre('save', function (next) {
  if (this.bedsOccupied >= this.bedsAvailable) {
    this.status = 'FULL';
  } else if (this.status === 'FULL' && this.bedsOccupied < this.bedsAvailable) {
    this.status = 'AVAILABLE';
  }
  next();
});

shelterSchema.index({ city: 1, status: 1 });
shelterSchema.index({ disaster: 1, status: 1 });

module.exports = mongoose.model('Shelter', shelterSchema);
