import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');
  const { currentUser } = useAuth();

  useEffect(() => {
    let mounted = true;

    const verifyEmail = async () => {
      // Validate URL parameters
      if (!oobCode || mode !== 'verifyEmail') {
        if (mounted) {
          setStatus('error');
          setError('Invalid verification link');
        }
        return;
      }

      // Helper function to wait for emailVerified status
      const waitForVerification = async (timeout = 5000, interval = 500) => {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
          if (auth.currentUser) {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
              return true;
            }
          }
          // If no currentUser, don't keep polling unless it changes
          await new Promise(resolve => setTimeout(resolve, interval));
        }
        return false;
      };

      try {
        // Attempt to apply the action code
        await applyActionCode(auth, oobCode);
        // Wait for emailVerified to update
        const isVerified = await waitForVerification();
        if (mounted) {
          if (isVerified) {
            setStatus('success');
          } else {
            // If no user is logged in or verification hasn't propagated, prompt login
            setStatus('success-login');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        // Check if email is already verified despite the error
        const isVerified = await waitForVerification();
        if (mounted) {
          if (isVerified) {
            setStatus('success');
          } else {
            setStatus('error');
            setError(
              error.code === 'auth/invalid-action-code'
                ? 'The verification link has expired or already been used.'
                : 'Failed to verify email. Please try again.'
            );
          }
        }
      }
    };

    verifyEmail();

    // Cleanup to prevent state updates after unmount
    return () => {
      mounted = false;
    };
  }, [oobCode, mode]);

  // Render UI based on status
  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Verifying your email...</h2>
            <p className="text-gray-600 mt-2">Please wait while we verify your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Email Verified Successfully!</h2>
            <p className="text-gray-600 mt-2">You can now access all features of EverCut.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        );

      case 'success-login':
        return (
          <div className="text-center">
            <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Email Verified Successfully!</h2>
            <p className="text-gray-600 mt-2">Please log in to continue.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <FaExclamationCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Verification Failed</h2>
            <p className="text-gray-600 mt-2">{error || 'The verification link may be invalid or expired.'}</p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Back to Login
              </button>
              <button
                onClick={() => navigate('/verify-email')}
                className="w-full px-6 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors"
              >
                Try Another Verification
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <img src="/logo/evercut.png" alt="Logo" className="h-12 mx-auto mb-8" />
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmailConfirmation;