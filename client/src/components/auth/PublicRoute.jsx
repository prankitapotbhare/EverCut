import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  // If user is verified, redirect away from auth routes
  if (currentUser?.emailVerified) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  // Allow unverified users to access only specific auth routes
  if (currentUser && !currentUser.emailVerified) {
    const allowedPaths = ['/verify-email', '/login', '/signup'];
    if (!allowedPaths.includes(location.pathname)) {
      return <Navigate to="/verify-email" state={{ email: currentUser.email }} replace />;
    }
  }

  return children;
};

export default PublicRoute;