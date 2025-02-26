import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requireVerified = true }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const publicPaths = ['/verify-email-confirmation', '/reset-password-confirmation'];

  // Allow access to confirmation pages without authentication
  if (publicPaths.includes(location.pathname)) {
    return children;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requireVerified && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;