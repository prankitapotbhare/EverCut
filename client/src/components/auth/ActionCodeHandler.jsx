import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ActionCodeHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleActionCode = () => {
      const searchParams = new URLSearchParams(location.search);
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      if (oobCode && mode) {
        switch (mode) {
          case 'verifyEmail':
            navigate(`/verify-email-confirmation?mode=${mode}&oobCode=${oobCode}`, { replace: true });
            break;
          case 'resetPassword':
            navigate(`/reset-password-confirmation?mode=${mode}&oobCode=${oobCode}`, { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }
    };

    handleActionCode();
  }, [location, navigate]);

  return children;
};

export default ActionCodeHandler;