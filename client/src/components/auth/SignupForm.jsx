import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleAuthButton } from '../ui/GoogleAuthButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupForm = () => {
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
      setAuthError(parseAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      await googleSignIn();
      navigate('/');
    } catch (error) {
      setAuthError(parseAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <img src="/assets/logo.png" alt="Logo" className="mb-8" />
        <h1 className="text-3xl font-bold mb-6">Get Started Now</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              {...register('location', { required: 'Location is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter your location"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email address</label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
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

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 pr-10"
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

          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              id="terms" 
              {...register('terms', { required: 'You must accept the terms & policy' })}
              className="mr-2" 
            />
            <label htmlFor="terms" className="text-gray-700">I agree to the terms & policy</label>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-700">or</span>
          <GoogleAuthButton />
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-700">Have an account?</span>
          <Link to="/login" className="text-green-500 hover:underline ml-1">Sign In</Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-100">
        <img src="/assets/auth-banner.jpg" alt="Authentication Banner" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default SignupForm;