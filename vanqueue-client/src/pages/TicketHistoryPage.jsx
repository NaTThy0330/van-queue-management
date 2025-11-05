import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

export default function TicketHistoryPage() {
  const [tickets, setTickets] = useState([]);
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
    async function fetchTickets() {
      try {
        const response = await api.get('/queue/tickets/history');
        setTickets(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Cannot load ticket history';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  return (
    <section className="card">
      <h1>Ticket History</h1>
      <p>Your past trips will appear here once completed.</p>

      {loading && <p>Loading history…</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && tickets.length === 0 && <p>No ticket history yet.</p>}

      {!loading && tickets.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Ticket Code</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Issued At</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.ticketCode}</td>
                <td>
                  {ticket.trip?.route
                    ? `${ticket.trip.route.origin} → ${ticket.trip.route.destination}`
                    : '—'}
                </td>
                <td>{ticket.trip ? formatter.format(new Date(ticket.trip.departTime)) : '—'}</td>
                <td>{formatter.format(new Date(ticket.issuedAt))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
