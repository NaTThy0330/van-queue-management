const admin = require('firebase-admin');
const config = require('./env');
const logger = require('../utils/logger');

let messagingInstance = null;

function parseServiceAccount(raw) {
  if (!raw) return null;
  try {
    const json = Buffer.from(raw, raw.trim().startsWith('{') ? 'utf8' : 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (error) {
    logger.error('Failed to parse FCM service account', error);
    return null;
  }
}

function initializeFirebase() {
  const credentials = parseServiceAccount(config.firebaseServiceAccount);
  if (!credentials) {
    logger.warn('FCM service account not provided. Notifications disabled.');
    return;
  }

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    messagingInstance = admin.messaging(app);
    logger.info('Firebase Admin initialized for FCM');
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin', error);
  }
}

initializeFirebase();

function getMessaging() {
  return messagingInstance;
}

function isNotificationsEnabled() {
  return Boolean(messagingInstance);
}

module.exports = {
  getMessaging,
  isNotificationsEnabled,
};
