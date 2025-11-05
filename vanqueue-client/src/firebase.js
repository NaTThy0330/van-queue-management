import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let messagingInstance = null;

export async function setupFirebaseMessaging() {
  if (!(await isSupported())) {
    throw new Error('Current browser does not support push notifications.');
  }

  const app = initializeApp(firebaseConfig);
  messagingInstance = getMessaging(app);
  return messagingInstance;
}

export async function requestFcmToken(vapidKey) {
  if (!messagingInstance) {
    await setupFirebaseMessaging();
  }
  const token = await getToken(messagingInstance, {
    vapidKey: vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: await navigator.serviceWorker.ready,
  });
  return token;
}

export function onForegroundMessage(callback) {
  if (!messagingInstance) {
    throw new Error('Messaging has not been initialized');
  }
  return onMessage(messagingInstance, callback);
}
