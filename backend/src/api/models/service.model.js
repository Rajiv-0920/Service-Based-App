import mongoose from 'mongoose';
// import Business from './business.model.js';
// import Category from './category.model.js';

const serviceSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: { type: String, required: true }, // e.g. "AC Repair & Service"
    description: { type: String, required: true },
    price: { type: Number, required: true },
    priceType: {
      type: String,
      required: true,
      enum: ['fixed', 'hourly', 'per_session', 'per_day'],
    },
    images: [{ type: String }], // array of image URLs
    city: { type: String, required: true }, // Where service is available
    availableDays: [{ type: String }],
    availableTime: {
      from: { type: String }, // e.g. "09:00"
      to: { type: String }, // e.g. "17:00"
    },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isListed: { type: Boolean, default: true },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true },
);

serviceSchema.index({ name: 'text', description: 'text' });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
