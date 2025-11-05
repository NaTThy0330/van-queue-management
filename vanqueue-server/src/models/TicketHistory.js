const mongoose = require('mongoose');

const { Schema } = mongoose;

const ticketHistorySchema = new Schema(
  {
    passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    queue: { type: Schema.Types.ObjectId, ref: 'Queue', required: true },
    ticketCode: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

ticketHistorySchema.index({ passenger: 1 });

module.exports = mongoose.model('TicketHistory', ticketHistorySchema);
