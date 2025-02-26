import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaSync } from 'react-icons/fa';
import { verifyEmailSettings } from '../../firebase/config';
import { parseAuthError } from '../../utils/auth';

const EmailVerification = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.emailVerified) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(prev => prev - 1);
      } else {
        // Refresh user token to check verification status
        currentUser?.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, currentUser]);

  // ... in the handleResendEmail function
  const handleResendEmail = async () => {
    try {
      setLoading(true);
      setError('');
      await currentUser.sendEmailVerification(verifyEmailSettings);
      setMessage('Verification email sent! Please check your inbox.');
      setCountdown(60);
    } catch (error) {
      setError(parseAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <img src="/evercut.svg" alt="Logo" className="h-12 mx-auto mb-6" />
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FaEnvelope className="text-green-500 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Check your email
        </h2>
        <p className="text-gray-600">
          We've sent a verification link to:
        </p>
        <p className="text-blue-600 font-medium mt-1">{email}</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-700">{message}</p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Didn't receive the email?</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-2">
            <li>Check your spam folder</li>
            <li>Verify the email address is correct</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading || countdown > 0}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <FaSync className="animate-spin" />
            ) : (
              <>
                <span>Resend verification email</span>
                {countdown > 0 && <span>({countdown}s)</span>}
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="text-green-500 hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;