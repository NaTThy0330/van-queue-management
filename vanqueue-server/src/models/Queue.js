const mongoose = require('mongoose');

const { Schema } = mongoose;

const queueSchema = new Schema(
  {
    passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    queueType: {
      type: String,
      enum: ['normal', 'standby'],
      default: 'normal',
    },
    seatNo: { type: Number, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

queueSchema.index({ trip: 1, passenger: 1 }, { unique: true });

module.exports = mongoose.model('Queue', queueSchema);
