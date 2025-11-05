const NotificationToken = require('../models/NotificationToken');
const { getMessaging, isNotificationsEnabled } = require('../config/firebase');
const logger = require('../utils/logger');

async function registerToken({ userId, token, platform, userAgent }) {
  if (!token) {
    throw Object.assign(new Error('Token is required'), { statusCode: 400 });
  }

  const payload = {
    user: userId,
    token,
    platform: platform || 'web',
    userAgent,
  };

  await NotificationToken.findOneAndUpdate({ token }, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}

async function removeToken(token) {
  if (!token) return;
  await NotificationToken.deleteOne({ token });
}

async function sendToTokens(tokens, notification, data) {
  if (!isNotificationsEnabled() || tokens.length === 0) {
    return;
  }

  try {
    const messaging = getMessaging();
    await messaging.sendEachForMulticast({
      tokens,
      notification,
      data,
    });
  } catch (error) {
    logger.error('Failed to send FCM notification', error);
  }
}

async function notifyReservationSubmitted({ userId, tripId, queueId }) {
  if (!isNotificationsEnabled()) return;

  const tokens = await NotificationToken.find({ user: userId }).distinct('token');
  if (tokens.length === 0) return;

  await sendToTokens(
    tokens,
    {
      title: 'Reservation Submitted',
      body: 'Your reservation is pending verification.',
    },
    {
      queueId: String(queueId),
      tripId: String(tripId),
      type: 'reservation_submitted',
    },
  );
}

module.exports = {
  registerToken,
  removeToken,
  notifyReservationSubmitted,
};
