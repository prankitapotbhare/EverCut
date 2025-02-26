import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { passwordValidation } from '../utils/validation';

const ResetPasswordConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('initial');
  
  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    const mode = searchParams.get('mode');

    if (!oobCode || mode !== 'resetPassword') {
      setStatus('error');
      setError('Invalid password reset link');
      setTimeout(() => {
        navigate('/forgot-password');
      }, 3000);
    }
  }, [searchParams, navigate]);

  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    // Validate the reset password link parameters
    if (!oobCode || mode !== 'resetPassword') {
      setStatus('error');
      setError('Invalid password reset link');
    }
  }, [oobCode, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!oobCode || mode !== 'resetPassword') {
      setStatus('error');
      setError('Invalid password reset link');
      return;
    }

    try {
      setStatus('processing');
      await confirmPasswordReset(auth, oobCode, password);
      setStatus('success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setStatus('error');
      setError(error.code === 'auth/invalid-action-code' 
        ? 'The password reset link has expired or already been used.' 
        : error.message);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'initial':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 pr-10"
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Reset Password
            </button>
          </form>
        );

      case 'processing':
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Resetting your password...</h2>
            <p className="text-gray-600 mt-2">Please wait while we process your request.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Password Reset Successfully!</h2>
            <p className="text-gray-600 mt-2">You can now log in with your new password.</p>
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
            <h2 className="text-xl font-semibold mt-4">Password Reset Failed</h2>
            <p className="text-gray-600 mt-2">{error || 'An error occurred during password reset.'}</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Try Again
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

export default ResetPasswordConfirmation;