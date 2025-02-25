import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const LoginForm = () => {
    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
          <div className="bg-white shadow-md rounded-lg flex max-w-4xl w-full">
            <div className="w-full px-15 py-2.5 md:w-1/2 p-8">
              <div className="flex items-center mb-6">
                <img 
                  src="/evercut.svg" 
                  alt="evercut logo" 
                  className="mt-3 mb-4" 
                  width="130" 
                  height="20" 
                />
              </div>
              <h2 className="text-3xl font-semibold mt-4">
                Welcome back!
              </h2>
              <p className="text-black-500 mb-10">Enter your Credentials to access your account</p>
              <form>
                <div className="mb-4">
                  <label className="block text-black-700 font-semibold text-sm" htmlFor="email">
                    Email address
                  </label>
                  <input 
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-black-700 font-semibold text-sm" htmlFor="password">
                    Password
                  </label>
                  <input 
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                  />
                  <div className="text-right mt-2">
                    <a 
                      className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800" 
                      href="#"
                    >
                      forgot password
                    </a>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox text-blue-500" />
                    <span className="ml-2 text-gray-700 text-sm">
                      Remember for 30 days
                    </span>
                  </label>
                </div>
                <div className="mb-6">
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline" 
                    type="button"
                  >
                    Login
                  </button>
                </div>
                <div className="text-center mb-4">
                  <span className="text-gray-500">
                    Or
                  </span>
                </div>
                <div className="mb-6">
                  <button 
                    className="mt-3 flex items-center justify-center w-5/8 mx-auto border border-gray-300 py-1.5 rounded-lg hover:bg-gray-100 transition duration-200 text-sm" 
                    type="button"
                  >
                    <FcGoogle className="mr-2 text-xl" />
                    Sign in with Google
                  </button>
                </div>
                <div className="text-center mt-2">
                  <p className="text-gray-600">
                    Don't have an account?
                    <a className="text-blue-500 hover:text-blue-800 font-semibold ml-1" href="#">
                      Sign Up
                    </a>
                  </p>
                </div>
              </form>
            </div>
            <div className="hidden md:block md:w-1/2">
              <img 
                src="./login.png" 
                alt="A hairdresser standing behind a seated customer, both smiling" 
                className="w-full h-full object-cover rounded-l-lg"
                width="600"
                height="800"
              />
            </div>
          </div>
        </div>
      );
};

export default LoginForm;