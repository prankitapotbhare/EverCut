import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-8 py-8">
        <nav className="flex justify-between items-center mb-12">
          <img 
            src="./evercut.svg" 
            alt="evercut logo" 
            className="h-12" 
          />
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to Evercut
          </h1>
          <p className="text-2xl text-gray-600 mb-12">
            Your one-stop destination for professional Haircuts & Styling services
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">For Customers</h2>
              <p className="text-gray-600 mb-6">
                Find and book appointments with top hairstylists in your area.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Get Started
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">For Stylists</h2>
              <p className="text-gray-600 mb-6">
                Join our platform and grow your business with new clients.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
