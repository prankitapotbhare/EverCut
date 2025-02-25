import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const SignupForm = () => {
    return (
        <div className="bg-gray-100 w-full min-h-screen">
          <div className="flex min-h-screen items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg flex max-h-[680px] aspect-[768/521]">
              <div className="w-full px-15 py-1.5 md:w-1/2 p-6">
                <div className="mb-6">
                  <img 
                    src="/evercut.svg" 
                    alt="evercut logo" 
                    className="mt-3 mb-4" 
                    width="130" 
                    height="20" 
                  />
                  <h1 className="text-3xl font-semibold mt-6">
                    Get Started Now
                  </h1>
                </div>
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm">
                      Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm">
                      Location
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your location" 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm">
                      Email address
                    </label>
                    <input 
                      type="email" 
                      placeholder="Enter email address" 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm">
                      Password
                    </label>
                    <input 
                      type="password" 
                      placeholder="Enter password" 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm">
                      Confirm Password
                    </label>
                    <input 
                      type="password" 
                      placeholder="Confirm password" 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                    />
                  </div>
                  <div className="mb-3 flex items-center">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="mr-2" 
                    />
                    <label htmlFor="terms" className="text-gray-700 text-[9px]">
                      I agree to the
                      <a href="#" className="text-green-500">
                        {' '}terms & policy
                      </a>
                    </label>
                  </div>
                  <div className="mt-10">
                    <button 
                      type="submit"
                      className="w-full bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600 transition duration-200 text-sm"
                    >
                      Signup
                    </button>
                  </div>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-gray-500 text-sm">
                    or
                  </p>
                  <button className="mt-3 flex items-center justify-center w-5/8 mx-auto border border-gray-300 px-1 py-1.5 rounded-lg hover:bg-gray-100 transition duration-200 text-sm">
                    <FcGoogle className="mr-2 text-lg" />
                    Sign in with Google
                  </button>
                  <p className="mt-3 text-gray-700 text-sm">
                    Have an account?
                    <a href="#" className="text-blue-500">
                      {' '}Sign In
                    </a>
                  </p>
                </div>
              </div>
              <div className="hidden md:block md:w-1/2 aspect-[3/4]">
                <img 
                  src="./signup.png" 
                  alt="Woman getting a haircut" 
                  className="w-full h-full object-cover rounded-l-[50px]"
                  width="600" 
                  height="800" 
                />
              </div>
            </div>
          </div>
        </div>
      );
};

export default SignupForm;








