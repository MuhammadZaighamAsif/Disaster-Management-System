const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    disaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disaster',
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    taskType: {
      type: String,
      enum: ['RESCUE', 'MEDICAL', 'FOOD_DISTRIBUTION', 'SHELTER_SETUP', 'COORDINATION', 'OTHER'],
      required: [true, 'Task type is required'],
      uppercase: true,
    },
    fieldType: {
      type: String,
      enum: ['ON_FIELD', 'OFF_FIELD'],
      required: [true, 'Field type is required'],
      uppercase: true,
      index: true,
    },
    volunteersRequired: {
      type: Number,
      required: [true, 'Number of volunteers required is needed'],
      min: [1, 'At least 1 volunteer is required'],
      default: 1,
    },
    volunteersAssigned: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignedVolunteers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['AVAILABLE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'AVAILABLE',
      uppercase: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
      uppercase: true,
    },
    location: {
      type: String,
      trim: true,
    },
    assignedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    estimatedDuration: {
      type: Number, // in hours
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
taskSchema.index({ volunteer: 1, status: 1 });
taskSchema.index({ status: 1, priority: -1 });
taskSchema.index({ disaster: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
