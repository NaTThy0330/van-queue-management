import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoutesPage from './pages/RoutesPage';
import TripsPage from './pages/TripsPage';
import ReserveQueuePage from './pages/ReserveQueuePage';
import QueueStatusPage from './pages/QueueStatusPage';
import TicketHistoryPage from './pages/TicketHistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import LostFoundPage from './pages/LostFoundPage';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route index element={<RoutesPage />} />
          <Route path="/routes/:routeId/trips" element={<TripsPage />} />
          <Route path="/queue/reserve" element={<ReserveQueuePage />} />
          <Route path="/queue/status" element={<QueueStatusPage />} />
          <Route path="/tickets/history" element={<TicketHistoryPage />} />
          <Route path="/lostfound" element={<LostFoundPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AppLayout>
  );
}
