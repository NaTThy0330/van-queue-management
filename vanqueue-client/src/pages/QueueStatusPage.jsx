import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

export default function QueueStatusPage() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const uploadsBase = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE_URL;
    if (!base) return '';
    try {
      const url = new URL(base);
      url.pathname = '/';
      return url.toString();
    } catch (err) {
      console.warn('Invalid API base URL', err);
      return '';
    }
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [],
  );

  useEffect(() => {
    async function fetchQueues() {
      try {
        const response = await api.get('/queue/status');
        setQueues(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Cannot load queue status';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchQueues();
  }, []);

  return (
    <section className="card">
      <h1>My Queue</h1>
      <p>Track your reservation status and payment verification.</p>

      {loading && <p>Loading queue status…</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && queues.length === 0 && <p>No reservations yet. Head to Reserve Queue to make one.</p>}

      {!loading && queues.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Departure</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {queues.map((queue) => (
              <tr key={queue.id}>
                <td>
                  {queue.trip?.route
                    ? `${queue.trip.route.origin} → ${queue.trip.route.destination}`
                    : '—'}
                </td>
                <td>{queue.trip ? formatter.format(new Date(queue.trip.departTime)) : '—'}</td>
                <td>
                  <span className="pill">{queue.status}</span>
                </td>
                <td>
                  {queue.payment ? (
                    <>
                      <span className="pill">{queue.payment.status}</span>
                      <div>Amount: {queue.payment.amount}</div>
                      {queue.payment.slipUrl && uploadsBase && (
                        <div>
                          <a href={`${uploadsBase}${queue.payment.slipUrl}`} target="_blank" rel="noreferrer" className="link">
                            View slip
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    'No payment'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
