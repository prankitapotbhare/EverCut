import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.displayName || 'User'}!</h1>
            <Button 
              variant="danger"
              onClick={handleLogout}
              isLoading={isLoading}
            >
              Logout
            </Button>
          </div>
          <p className="text-slate-300">
            You're now logged in with: {currentUser?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;