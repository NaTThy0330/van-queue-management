const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, default: 'web' },
    userAgent: { type: String },
    subscribedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

notificationTokenSchema.index({ user: 1 });

module.exports = mongoose.model('NotificationToken', notificationTokenSchema);
