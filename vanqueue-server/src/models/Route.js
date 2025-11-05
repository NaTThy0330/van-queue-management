const mongoose = require('mongoose');

const { Schema } = mongoose;

const routeSchema = new Schema(
  {
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    distanceKm: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  },
);

routeSchema.index({ origin: 1, destination: 1 }, { unique: true });

module.exports = mongoose.model('Route', routeSchema);
