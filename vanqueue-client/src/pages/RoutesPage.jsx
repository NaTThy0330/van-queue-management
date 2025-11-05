import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await api.get('/routes');
        setRoutes(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Cannot load routes';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchRoutes();
  }, []);

  return (
    <section className="card">
      <h1>Available Routes</h1>
      <p>Select a route to inspect trip schedules.</p>

      {loading && <p>Loading routes…</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && routes.length === 0 && <p>No routes configured yet.</p>}

      {!loading && routes.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Distance (km)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td>{route.origin}</td>
                <td>{route.destination}</td>
                <td>{route.distanceKm}</td>
                <td>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      navigate(`/routes/${route.id}/trips`, {
                        state: { route },
                      })
                    }
                  >
                    View trips
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
