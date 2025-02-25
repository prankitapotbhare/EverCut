import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { GoogleAuthButton } from './GoogleAuthButton';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Firebase login logic will be implemented here
      console.log(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <img src="/assets/logo.png" alt="Logo" className="mb-8" />
        <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
        <p className="text-gray-600 mb-6">Enter your Credentials to access your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
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
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-700">or</span>
          <GoogleAuthButton />
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-700">Don't have an account?</span>
          <Link to="/signup" className="text-blue-500 hover:underline ml-1">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-100">
        <img src="/assets/auth-banner.jpg" alt="Authentication Banner" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default LoginForm;