import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

const initialState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSuccess('Registration successful. You can now sign in.');
      setForm(initialState);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const message = err.response?.data?.message || 'Cannot register right now';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card" aria-labelledby="register-title">
      <h1 id="register-title">Create Passenger Account</h1>
      <p>Register with your contact details to reserve van tickets.</p>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            pattern="[0-9]{9,15}"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>

      <p>
        Already registered?{' '}
        <Link to="/login" className="link">
          Sign in
        </Link>
      </p>
    </section>
  );
}
