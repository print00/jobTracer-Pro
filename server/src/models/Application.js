import mongoose from 'mongoose';

export const APP_STAGES = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    roleTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: ''
    },
    jobUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    stage: {
      type: String,
      enum: APP_STAGES,
      default: 'Wishlist'
    },
    appliedDate: {
      type: Date,
      default: null
    },
    followUpDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: ''
    }
  },
  { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);
