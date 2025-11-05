import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function TripsPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [route, setRoute] = useState(location.state?.route || null);
  const [trips, setTrips] = useState([]);
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
    async function hydrateRoute() {
      if (route) return;
      try {
        const response = await api.get('/routes');
        const found = response.data.data.find((item) => item.id === routeId);
        if (found) {
          setRoute(found);
        }
      } catch (err) {
        // silently ignore, route name is optional
      }
    }

    hydrateRoute();
  }, [route, routeId]);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await api.get(`/routes/${routeId}/trips`);
        setTrips(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Cannot load trips';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [routeId]);

  return (
    <section className="card">
      <button type="button" className="link" onClick={() => navigate(-1)}>
        ← Back to routes
      </button>

      <h1>Trip Schedule</h1>
      {route && (
        <p>
          {route.origin} → {route.destination} ({route.distanceKm} km)
        </p>
      )}

      {loading && <p>Loading trips…</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && trips.length === 0 && <p>No trips scheduled for this route.</p>}

      {!loading && trips.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Departure</th>
              <th>Status</th>
              <th>Van</th>
              <th>Seats</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{formatter.format(new Date(trip.departTime))}</td>
                <td>
                  <span className="pill">{trip.status}</span>
                </td>
                <td>{trip.van ? `${trip.van.plateNumber}` : 'Unassigned'}</td>
                <td>{trip.van ? trip.van.seatCapacity : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: '1.5rem' }}>
        Ready to reserve? This prototype only covers browsing; queue booking will be implemented in a future sprint.
      </p>

      <p>
        Need a different route? <Link to="/" className="link">Browse routes</Link>
      </p>
    </section>
  );
}
