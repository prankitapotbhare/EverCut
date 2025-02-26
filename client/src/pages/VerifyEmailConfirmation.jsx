import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!oobCode || mode !== 'verifyEmail') {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setStatus('success');
        
        if (auth.currentUser) {
          await auth.currentUser.reload();
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setError(error.code === 'auth/invalid-action-code' 
          ? 'The verification link has expired or already been used.' 
          : error.message);
      }
    };

    verifyEmail();
  }, [oobCode, mode, navigate]);

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

      case 'error':
        return (
          <div className="text-center">
            <FaExclamationCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Verification Failed</h2>
            <p className="text-gray-600 mt-2">{error || 'The verification link may be invalid or expired.'}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Back to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <img src="/evercut.svg" alt="Logo" className="h-12 mx-auto mb-8" />
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmailConfirmation;