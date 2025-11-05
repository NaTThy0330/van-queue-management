/* eslint-disable no-restricted-globals */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

let messaging = null;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_FIREBASE') {
    const config = event.data.payload;
    if (!messaging) {
      firebase.initializeApp(config);
      messaging = firebase.messaging();
      messaging.onBackgroundMessage((payload) => {
        const { title, body } = payload.notification || {};
        self.registration.showNotification(title || 'Van Queue Notification', {
          body,
          data: payload.data,
        });
      });
    }
  }
});
