"
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [],
  );

  useEffect(() => {
    async function fetchLostFound() {
      try {
        const response = await api.get('/lostfound');
        setItems(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Cannot load lost & found items';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchLostFound();
  }, []);

  return (
    <section className="card">
      <h1>Lost &amp; Found</h1>
      <p>Drivers will post found items here so you can reconnect with your belongings.</p>

      {loading && <p>Loading items…</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && items.length === 0 && <p>No items reported yet.</p>}

      {!loading && items.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Reported</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.item}</td>
                <td>{item.description}</td>
                <td>
                  {item.trip?.route
                    ? `${item.trip.route.origin} → ${item.trip.route.destination}`
                    : '—'}
                </td>
                <td>
                  {item.driver ? (
                    <>
                      <div>{item.driver.name}</div>
                      <small>{item.driver.phone}</small>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{formatter.format(new Date(item.createdAt))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
