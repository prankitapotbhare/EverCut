import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleAuthButton } from '@/components/ui/GoogleAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { parseAuthError } from '@/utils/auth';
import { emailValidation, passwordValidation } from '@/utils/validation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '@/components/ui/Button';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, googleSignIn, linkEmailProvider } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setAuthError('');
      await login(data.email, data.password);
      const destination = location.state?.from || '/';
      // Add a small delay to ensure auth state is updated
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 500);
    } catch (error) {
      setAuthError(parseAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    let googleUser = null;
    try {
      setIsLoading(true);
      setAuthError('');
      googleUser = await googleSignIn();
      const destination = location.state?.from || '/';
      // Add a small delay to ensure auth state is updated
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 500);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      if (error.code === 'auth/account-exists-with-different-credential' && googleUser) {
        try {
          // Handle the case where email exists with different provider
          const linkedCredential = await linkEmailProvider(googleUser.email);
          if (linkedCredential) {
            navigate('/');
          } else {
            setAuthError('This email is already registered. Please use email/password to login.');
          }
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
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Right Section for Mobile */}
      <div className="md:hidden w-full h-[240px] bg-gray-100 rounded-b-[50px] overflow-hidden">
        <img src="https://i.imgur.com/2ZXwoGU.jpg" alt="Authentication Banner" className="w-full h-full object-cover" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8 md:p-8">
        <div className="w-full max-w-[360px]">
          <img src="/logo/evercut.png" alt="Logo" className="h-8 mb-6 md:mb-8" />
          <h1 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-bold text-black-900 mb-2">Welcome back!</h1>
          <p className="text-sm text-black-600 font-semibold mb-6 md:mb-8">Enter your Credentials to access your account</p>

          {authError && (
            <div className="mb-4 w-full bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 md:space-y-0">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black-700 font-semibold mb-1">Email address</label>
              <input
                type="email"
                id="email"
                {...register('email', emailValidation)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-black-700 font-semibold">Password</label>
                <Link to="/forgot-password" className="text-sm text-[#0066FF] hover:underline font-semibold">
                  forgot password
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register('password', passwordValidation)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base pr-10"
                  placeholder="Enter you password"
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

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                {...register('remember')}
                className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-semibold">
                Remember for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              className="mb-6 bg-[#00B341] hover:bg-[#00A33B] h-11 text-base font-medium"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleAuthButton onClick={handleGoogleSignIn} isLoading={isLoading} />
            </div>

            <div className="text-center mt-6">
              <span className="text-gray-700 font-semibold">Don't have an account?</span>
              <Link to="/signup" className="text-blue-700 hover:text-blue-800 font-semibold ml-1">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:block w-1/2">
        <img src="https://i.imgur.com/2ZXwoGU.jpg" alt="Authentication Banner" className="w-full h-full object-cover rounded-l-[50px]" />
      </div>
    </div>
  );
};

export default Login;