import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles.css';

async function registerFirebaseServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) return;

  try {
    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({
      type: 'INIT_FIREBASE',
      payload: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      },
    });
  } catch (error) {
    console.warn('Failed to register Firebase messaging service worker', error);
  }
}

registerFirebaseServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
