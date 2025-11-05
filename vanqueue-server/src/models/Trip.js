const mongoose = require('mongoose');

const { Schema } = mongoose;

const tripSchema = new Schema(
  {
    route: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    van: { type: Schema.Types.ObjectId, ref: 'Van', required: true },
    departTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'departed', 'completed'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  },
);

tripSchema.index({ route: 1, departTime: 1 });

module.exports = mongoose.model('Trip', tripSchema);
