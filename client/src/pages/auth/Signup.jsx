import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleAuthButton } from '@/components/ui/GoogleAuthButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { parseAuthError } from '@/utils/auth';
import { 
  emailValidation, 
  passwordValidation, 
  nameValidation, 
  locationValidation, 
  termsValidation,
  validatePasswordMatch 
} from '@/utils/validation';
import Button from '@/components/ui/Button';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      await googleSignIn();
      const destination = location.state?.from || '/';
      // Add a small delay to ensure auth state is updated
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 500);
    } catch (error) {
      if (error.message === 'EMAIL_EXISTS_DIFFERENT_PROVIDER') {
        setAuthError('An account already exists with this email. Please use email/password login.');
      } else {
        setAuthError(parseAuthError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setAuthError('');
      await signup(data.email, data.password, data.name, data.location);
      navigate('/verify-email', { state: { email: data.email } });
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError(parseAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Right Section for Mobile */}
      <div className="md:hidden w-full h-[240px] bg-gray-100 rounded-b-[50px] overflow-hidden">
        <img src="/Signup-Right.jpeg" alt="Authentication Banner" className="w-full h-full object-cover" />
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8 md:p-8">
        <div className="w-full max-w-[360px]">
          <img src="/logo/evercut.png" alt="Logo" className="h-8 mb-6 md:mb-8" />
        <h1 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-bold text-black-900 mb-2">Get Started Now</h1>
         
        {authError && (
          <div className="mb-4 w-full max-w-xs bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 md:space-y-0 mt-10">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-black-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              id="name"
              {...register('name', nameValidation)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900 text-base"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-black-700 font-semibold mb-1">Location</label>
            <input
              type="text"
              id="location"
              {...register('location', locationValidation)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900 text-base"
              placeholder="Enter your location"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black-700 font-semibold mb-1">Email address</label>
            <input
              type="email"
              id="email"
              {...register('email', emailValidation)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900 text-base"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-black-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register('password', passwordValidation)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900 text-base pr-10"
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

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black-700 font-semibold mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => validatePasswordMatch(getValues('password'), value)
                })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900 text-base pr-10"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex items-center mb-6">
            <input 
              type="checkbox" 
              id="terms" 
              {...register('terms', termsValidation)}
              className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500 mr-2" 
            />
            <label htmlFor="terms" className="text-sm text-gray-700 font-semibold">I agree to the terms & policy</label>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
          </div>

          <Button
            type="submit"
            variant="secondary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            className="mb-6 bg-[#00B341] hover:bg-[#00A33B] h-11 text-base font-medium"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

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
            <span className="text-gray-700 font-semibold">Have an account?</span>
            <Link to="/login" className="text-blue-700 hover:text-blue-800 font-semibold ml-1">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:block w-1/2">
        <img src="/Signup-Right.jpeg" alt="Authentication Banner" className="w-full h-full object-cover rounded-l-[50px]" />
      </div>
    </div>
  );
};

export default Signup;