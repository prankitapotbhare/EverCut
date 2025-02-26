import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requireVerified = true }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const publicPaths = ['/verify-email-confirmation', '/reset-password-confirmation'];

  if (publicPaths.includes(location.pathname)) {
    return children;
  }

  if (!currentUser) {
    // Save the current path as the redirect destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireVerified && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" state={{ email: currentUser.email }} replace />;
  }

  return children;
};

export default PrivateRoute;