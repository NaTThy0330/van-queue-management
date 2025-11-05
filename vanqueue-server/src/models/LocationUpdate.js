const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationUpdateSchema = new Schema(
  {
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

locationUpdateSchema.index({ trip: 1, timestamp: -1 });

module.exports = mongoose.model('LocationUpdate', locationUpdateSchema);
