import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const actionPaths = ['/verify-email-confirmation', '/reset-password-confirmation'];

  if (loading) {
    return null;
  }

  // Allow access to action paths regardless of auth state
  if (actionPaths.includes(location.pathname)) {
    return children;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect unverified users to verify email page
  if (!currentUser.emailVerified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" state={{ email: currentUser.email, from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;