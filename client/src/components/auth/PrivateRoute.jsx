import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requireVerified = true }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Allow verification links to pass through
  const isVerificationLink = location.search.includes('mode=verifyEmail');
  if (isVerificationLink) {
    return <Navigate to={`/verify-email-confirmation${location.search}`} />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireVerified && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  return children;
};

export default PrivateRoute;