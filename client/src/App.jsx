import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
import PrivateRoute from './components/auth/PrivateRoute';
import ErrorBoundary from './components/error/ErrorBoundary';
import ErrorHandler from './components/error/ErrorHandler';
import { useState } from 'react';
import VerifyEmailConfirmation from './pages/VerifyEmailConfirmation';
import ResetPasswordConfirmation from './pages/ResetPasswordConfirmation';
import ActionCodeHandler from './components/auth/ActionCodeHandler';

function App() {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    setError(error);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ActionCodeHandler>
            <ErrorHandler error={error} onClose={() => setError(null)} />
            <Routes>
              {/* Action Code Handler Routes - Must be first */}
              // Change these routes
              <Route 
                path="/verify-email-confirmation" 
                element={<VerifyEmailConfirmation onError={handleError} />}
              />
              <Route 
                path="/reset-password-confirmation" 
                element={<ResetPasswordConfirmation onError={handleError} />}
              />

              {/* Public Routes */}
              <Route path="/login" element={<Login onError={handleError} />} />
              <Route path="/signup" element={<Signup onError={handleError} />} />
              <Route path="/forgot-password" element={<ForgotPassword onError={handleError} />} />
              <Route path="/verify-email" element={<VerifyEmail onError={handleError} />} />

              {/* Protected Home Route */}
              <Route 
                path="/"
                element={
                  <PrivateRoute>
                    <Home onError={handleError} />
                  </PrivateRoute>
                } 
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ActionCodeHandler>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
