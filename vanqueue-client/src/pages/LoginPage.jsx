import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const initialState = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      login(response.data.token, response.data.user);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Cannot sign in right now';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card" aria-labelledby="login-title">
      <h1 id="login-title">Passenger Login</h1>
      <p>Sign in to manage your van queue reservations.</p>

      {error && <div className="error-banner">{error}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
          />
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <p>
        New passenger?{' '}
        <Link to="/register" className="link">
          Create an account
        </Link>
      </p>
    </section>
  );
}
