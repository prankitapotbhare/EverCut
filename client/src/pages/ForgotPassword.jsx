import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { emailValidation } from '../utils/validation';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { resetPassword } = useAuth();
  const [status, setStatus] = useState('initial');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setStatus('processing');
      await resetPassword(data.email);
      setStatus('success');
    } catch (error) {
      console.error('Password reset error:', error);
      setStatus('error');
      setError('Failed to reset password. Please try again.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'initial':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  id="email"
                  {...register('email', emailValidation)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Reset Password
              </button>

              <div className="text-center">
                <Link to="/login" className="text-green-500 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        );

      case 'processing':
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Sending Reset Instructions...</h2>
            <p className="text-gray-600 mt-2">Please wait while we process your request.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Check Your Email</h2>
            <p className="text-gray-600 mt-2">We've sent password reset instructions to your email.</p>
            <Link
              to="/login"
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block"
            >
              Back to Login
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <FaExclamationCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Reset Failed</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              onClick={() => setStatus('initial')}
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
        <img src="/logo/evercut.svg" alt="Logo" className="h-12 mx-auto mb-8" />
        {renderContent()}
      </div>
    </div>
  );
};

export default ForgotPassword;