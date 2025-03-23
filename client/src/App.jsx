import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SalonProvider } from '@/contexts/SalonContext';
import Signup from '@/pages/auth/Signup';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import Home from '@/pages/Home';
import PrivateRoute from '@/components/auth/PrivateRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import ErrorHandler from '@/components/error/ErrorHandler';
import { useState } from 'react';
import VerifyEmailConfirmation from '@/pages/auth/VerifyEmailConfirmation';
import ResetPasswordConfirmation from '@/pages/auth/ResetPasswordConfirmation';
import ActionCodeHandler from '@/components/auth/ActionCodeHandler';
import SalonDetailPage from '@/pages/salon/SalonDetailPage';
import BookingPage from '@/pages/salon/BookingPage';

function AppRoutes() {
  const [error, setError] = useState(null);
  const { loading } = useAuth();

  const handleError = (error) => {
    setError(error);
    setTimeout(() => setError(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <ActionCodeHandler>
        <ErrorHandler error={error} onClose={() => setError(null)} />
        <Routes>
          {/* Action Code Handler Routes */}
          <Route 
            path="/verify-email-confirmation" 
            element={<VerifyEmailConfirmation onError={handleError} />}
          />
          <Route 
            path="/reset-password-confirmation" 
            element={<ResetPasswordConfirmation onError={handleError} />}
          />

          {/* Public Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login onError={handleError} />
              </PublicRoute>
            }
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup onError={handleError} />
              </PublicRoute>
            }
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword onError={handleError} />
              </PublicRoute>
            }
          />

          {/* Email Verification Route */}
          <Route 
            path="/verify-email" 
            element={
              <PublicRoute>
                <VerifyEmail onError={handleError} />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route path="/salon/:id" element={
            <PrivateRoute>
              <SalonDetailPage />
            </PrivateRoute>} 
          />
          
          {/* Booking Route */}
          <Route path="/salon/:id/booking" element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>} 
          />

          {/* Home Route */}
          <Route 
            path="/"
            element={
                <Home onError={handleError} />
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ActionCodeHandler>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SalonProvider>
          <AppRoutes />
        </SalonProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
