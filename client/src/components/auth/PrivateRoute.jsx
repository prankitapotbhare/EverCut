import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const actionPaths = ['/verify-email-confirmation', '/reset-password-confirmation'];

  if (loading) {
    return null;
  }

  if (actionPaths.includes(location.pathname)) {
    return children;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (!currentUser.emailVerified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" state={{ email: currentUser.email, from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;