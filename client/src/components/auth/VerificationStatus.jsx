import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { verifyEmailSettings } from '../../firebase/config';

const VerificationStatus = ({ email, showResend = true }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setError('');
      await currentUser.sendEmailVerification(verifyEmailSettings);
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Please verify your email address ({email})
          </p>
          {showResend && (
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="text-sm text-green-700 underline hover:text-green-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;