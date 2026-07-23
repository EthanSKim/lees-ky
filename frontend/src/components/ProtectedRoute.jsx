import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="route-checking" role="status" aria-live="polite">
        Checking your session…
      </div>
    );
  }

  if (status === 'unauthenticated') {
    // Remember where they were headed so login can send them back after.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
