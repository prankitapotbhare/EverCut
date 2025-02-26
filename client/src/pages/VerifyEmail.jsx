import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailVerification from '../components/auth/EmailVerification';
import VerificationStatus from '../components/auth/VerificationStatus';

const VerifyEmail = () => {
  const { currentUser, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const email = location.state?.email || currentUser?.email;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.emailVerified) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl text-gray-700">
            No email address found. Please log in again.
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <VerificationStatus 
          email={email} 
          showResend={false}
        />
        <div className="mt-8">
          <EmailVerification email={email} />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;