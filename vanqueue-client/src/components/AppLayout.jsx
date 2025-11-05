import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/">
          <strong>Van Queue &amp; Departure</strong>
        </Link>
        <nav className="nav-links">
          {isAuthenticated && <Link to="/">Routes</Link>}
          {isAuthenticated && <Link to="/queue/reserve">Reserve</Link>}
          {isAuthenticated && <Link to="/queue/status">My Queue</Link>}
          {isAuthenticated && <Link to="/tickets/history">Ticket History</Link>}
          {isAuthenticated && <Link to="/lostfound">Lost &amp; Found</Link>}
          {isAuthenticated && <Link to="/notifications">Notifications</Link>}
          {!isAuthenticated && <Link to="/register">Register</Link>}
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {isAuthenticated && (
            <>
              <span>{user?.name}</span>
              <button type="button" className="nav-button" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
