"
import { useState } from 'react';
import api from '../api/client';
import { requestFcmToken, setupFirebaseMessaging } from '../firebase';

export default function NotificationsPage() {
  const [status, setStatus] = useState(() => Notification.permission);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const firebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

  const handleEnable = async () => {
    setError('');
    setMessage('');

    if (!firebaseConfigured) {
      setError('Firebase configuration is missing.');
      return;
    }

    try {
      setLoading(true);
      await setupFirebaseMessaging();
      const permission = await Notification.requestPermission();
      setStatus(permission);

      if (permission !== 'granted') {
        setError('Notification permission denied.');
        return;
      }

      const token = await requestFcmToken();
      await api.post('/notifications/token', {
        token,
        platform: 'web',
      });

      setMessage('Notifications enabled successfully.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to enable notifications';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h1>Notification Settings</h1>
      <p>Enable browser push notifications for reservation updates and reminders.</p>

      {!firebaseConfigured && (
        <div className="error-banner">
          Firebase configuration is not set. Update your <code>.env</code> to enable notifications.
        </div>
      )}

      {message && <div className="success-banner">{message}</div>}
      {error && <div className="error-banner">{error}</div>}

      <div className="form-grid">
        <div className="form-control">
          <label>Browser permission</label>
          <span className="pill">{status}</span>
        </div>
        <button type="button" className="primary-button" onClick={handleEnable} disabled={loading}>
          {loading ? 'Enabling…' : 'Enable Notifications'}
        </button>
      </div>
    </section>
  );
}
