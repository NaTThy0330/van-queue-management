import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const initialState = {
  routeId: '',
  tripId: '',
  amount: '',
  queueType: 'normal',
  paymentSlip: null,
};

export default function ReserveQueuePage() {
  const [form, setForm] = useState(initialState);
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await api.get('/routes');
        setRoutes(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Cannot load routes';
        setError(message);
      } finally {
        setLoadingRoutes(false);
      }
    }

    fetchRoutes();
  }, []);

  useEffect(() => {
    if (!form.routeId) {
      setTrips([]);
      setForm((prev) => ({ ...prev, tripId: '' }));
      return;
    }

    async function fetchTrips() {
      setLoadingTrips(true);
      try {
        const response = await api.get(`/routes/${form.routeId}/trips`);
        setTrips(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Cannot load trips';
        setError(message);
      } finally {
        setLoadingTrips(false);
      }
    }

    fetchTrips();
  }, [form.routeId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setForm((prev) => ({ ...prev, paymentSlip: event.target.files?.[0] || null }));
  };

  const resetForm = () => {
    setForm(initialState);
    setTrips([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.paymentSlip) {
      setError('Please upload a payment slip image.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('tripId', form.tripId);
      payload.append('queueType', form.queueType);
      payload.append('amount', form.amount);
      payload.append('paymentSlip', form.paymentSlip);

      const response = await api.post('/queue/reserve', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(response.data.message || 'Reservation submitted');
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || 'Reservation failed, please try again';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const routeOptions = useMemo(
    () =>
      routes.map((route) => (
        <option key={route.id} value={route.id}>
          {route.origin} → {route.destination}
        </option>
      )),
    [routes],
  );

  const tripOptions = useMemo(
    () =>
      trips.map((trip) => (
        <option key={trip.id} value={trip.id}>
          {new Date(trip.departTime).toLocaleString()} – {trip.van?.plateNumber || 'Unassigned'}
        </option>
      )),
    [trips],
  );

  return (
    <section className="card">
      <h1>Reserve Queue</h1>
      <p>Submit your booking request and upload a payment slip for verification.</p>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="routeId">Route</label>
          <select
            id="routeId"
            name="routeId"
            required
            value={form.routeId}
            onChange={handleInputChange}
            disabled={loadingRoutes}
          >
            <option value="">Select route</option>
            {routeOptions}
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="tripId">Trip</label>
          <select
            id="tripId"
            name="tripId"
            required
            value={form.tripId}
            onChange={handleInputChange}
            disabled={!form.routeId || loadingTrips}
          >
            <option value="">{form.routeId ? 'Select trip' : 'Choose route first'}</option>
            {tripOptions}
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="queueType">Queue type</label>
          <select id="queueType" name="queueType" value={form.queueType} onChange={handleInputChange}>
            <option value="normal">Normal</option>
            <option value="standby">Standby</option>
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="amount">Payment amount (THB)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="1"
            required
            value={form.amount}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="paymentSlip">Payment slip image</label>
          <input id="paymentSlip" name="paymentSlip" type="file" accept="image/*" required onChange={handleFileChange} />
        </div>

        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Reserve Queue'}
        </button>
      </form>
    </section>
  );
}
