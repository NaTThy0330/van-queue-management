const mongoose = require('mongoose');

const { Schema } = mongoose;

const lostFoundSchema = new Schema(
  {
    item: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip' },
    driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

lostFoundSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LostFound', lostFoundSchema);
