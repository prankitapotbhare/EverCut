import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthButton } from '../ui/GoogleAuthButton';
import { useAuth } from '../../contexts/AuthContext';
import { parseAuthError } from '../../utils/auth';
import { emailValidation, passwordValidation } from '../../utils/validation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, googleSignIn, linkEmailProvider } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setAuthError('');
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      setAuthError(parseAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      const user = await googleSignIn();
      
      if (user.emailVerified) {
        navigate('/');
      } else {
        navigate('/verify-email', { state: { email: user.email } });
      }
    } catch (error) {
      if (error.message === 'EMAIL_EXISTS_DIFFERENT_PROVIDER') {
        try {
          await linkEmailProvider(user.email, password);
          navigate('/');
        } catch (linkError) {
          setAuthError('Failed to link accounts. Please try logging in with email/password.');
        }
      } else {
        setAuthError(parseAuthError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <img src="/evercut.svg" alt="Logo" className="mb-8" />
        <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
        <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

        {authError && (
          <div className="mb-4 w-full max-w-xs bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email address</label>
            <input
              type="email"
              id="email"
              {...register('email', emailValidation)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register('password', passwordValidation)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                {...register('remember')}
                className="mr-2" 
              />
              <label htmlFor="remember" className="text-gray-700">Remember for 30 days</label>
            </div>
            <Link to="/forgot-password" className="text-green-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-700">or</span>
          <GoogleAuthButton onClick={handleGoogleSignIn} isLoading={isLoading} />
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-700">Don't have an account?</span>
          <Link to="/signup" className="text-green-500 hover:underline ml-1">
            Sign Up
          </Link>
        </div>
      </div>

      <div className="w-1/2 bg-gray-100">
        <img src="/assets/auth-banner.jpg" alt="Authentication Banner" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default LoginForm;