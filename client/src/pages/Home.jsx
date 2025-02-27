import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Home = () => {
  const { currentUser, logout, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

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

  const handleResetPassword = async () => {
    try {
      setResetLoading(true);
      setResetMessage('');
      await resetPassword(currentUser.email);
      setResetMessage('Password reset email has been sent. Please check your inbox.');
    } catch (error) {
      console.error('Reset password error:', error);
      setResetMessage('Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
      // Clear success message after 5 seconds
      setTimeout(() => setResetMessage(''), 5000);
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
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-slate-300">
                You're now logged in with: {currentUser?.email}
              </p>
              <Button
                variant="primary"
                onClick={handleResetPassword}
                isLoading={resetLoading}
              >
                Reset Password
              </Button>
            </div>
            {resetMessage && (
              <div className={`p-4 rounded-lg ${resetMessage.includes('Failed') ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
                {resetMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;