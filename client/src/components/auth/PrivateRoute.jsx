import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requireVerified = true }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireVerified && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  return children;
};

export default PrivateRoute;