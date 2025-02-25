import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useProtectedRoute = (requireVerified = true) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!currentUser) {
          navigate('/login');
          return;
        }

        if (requireVerified && !currentUser.emailVerified) {
          navigate('/verify-email', { 
            state: { email: currentUser.email }
          });
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [currentUser, navigate, requireVerified]);

  return { isAuthorized, isLoading };
};