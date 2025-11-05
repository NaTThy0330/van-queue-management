const mongoose = require('mongoose');

const { Schema } = mongoose;

const vanSchema = new Schema(
  {
    plateNumber: { type: String, required: true, unique: true, trim: true },
    model: { type: String, trim: true },
    seatCapacity: { type: Number, required: true, min: 1 },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

vanSchema.index({ driver: 1 });

module.exports = mongoose.model('Van', vanSchema);
