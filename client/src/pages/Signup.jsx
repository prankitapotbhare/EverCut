import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from '../components/ui/GoogleAuthButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { parseAuthError } from '../utils/auth';
import { 
  emailValidation, 
  passwordValidation, 
  nameValidation, 
  locationValidation, 
  termsValidation,
  validatePasswordMatch 
} from '../utils/validation';
import Button from '../components/ui/Button';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        setAuthError('An account already exists with this email. Please use email/password login.');
      } else {
        setAuthError(parseAuthError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-6">
        <div className="w-full max-w-md px-4">
          <img src="/evercut.svg" alt="Logo" className="mb-4 max-w-[150px]" />
          <h1 className="text-xl lg:text-3xl font-semibold mb-4">Get Started Now</h1>
          
          {authError && (
            <div className="mb-3 w-full bg-red-50 border-l-4 border-red-500 p-2 rounded">
              <p className="text-red-700 text-xs">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-black-700 font-semibold text-xs font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                {...register('name', nameValidation)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>}
            </div>

            {/* Location Input */}
            <div className="mb-4">
              <label htmlFor="location" className="block text-black-700 font-semibold text-xs font-medium mb-1">Location</label>
              <input
                type="text"
                id="location"
                {...register('location', locationValidation)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500 text-xs mt-0.5">{errors.location.message}</p>}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-black-700 font-semibold text-xs font-medium mb-1">Email address</label>
              <input
                type="email"
                id="email"
                {...register('email', emailValidation)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-black-700 font-semibold text-xs font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register('password', passwordValidation)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-black-700 font-semibold text-xs font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => validatePasswordMatch(getValues('password'), value)
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm pr-10"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start mb-3">
              <input 
                type="checkbox" 
                id="terms" 
                {...register('terms', termsValidation)}
                className="mt-0.5 mr-2" 
              />
              <label htmlFor="terms" className="text-black-700 font-semibold text-xs">I agree to the terms & policy</label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-0.5">{errors.terms.message}</p>}

            {/* Submit Button */}
            <div className="mt-10">
              <Button
                type="submit"
                variant="secondary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
                className="py-1.5 text-sm"
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </div>
          </form>

          {/* Google Sign In */}
          <div className="mt-3 text-center">
            <span className="text-gray-700 text-xs">or</span>
            <GoogleAuthButton onClick={handleGoogleSignIn} isLoading={isLoading} />
          </div>

          {/* Login Link */}
          <div className="mt-3 text-center">
            <span className="text-gray-600 mb-8 font-semibold">Have an account?</span>
            <Link to="/login" className="text-blue-500 hover:text-blue-800 font-semibold ml-1">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block w-1/2">
        <img 
          src="/Signup-Right.jpeg" 
          alt="Authentication Banner" 
          className="w-full h-screen object-cover rounded-tl-[50px] rounded-bl-[50px]"
        />
      </div>
    </div>
  );
};

export default Signup;