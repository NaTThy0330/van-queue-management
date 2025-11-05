const mongoose = require('mongoose');

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    queue: { type: Schema.Types.ObjectId, ref: 'Queue', required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    slipUrl: { type: String },
    status: {
      type: String,
      enum: ['waiting', 'verified', 'rejected'],
      default: 'waiting',
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
