import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    setError(error);
    setTimeout(() => setError(null), 5000); // Auto-dismiss after 5 seconds
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ErrorHandler error={error} onClose={() => setError(null)} />
          <Routes>
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Home onError={handleError} />
                </PrivateRoute>
              } 
            />

            {/* Auth Routes */}
            <Route path="/login" element={<Login onError={handleError} />} />
            <Route path="/signup" element={<Signup onError={handleError} />} />
            <Route path="/forgot-password" element={<ForgotPassword onError={handleError} />} />
            <Route path="/verify-email" element={<VerifyEmail onError={handleError} />} />
            <Route path="/verify-email-confirmation" element={<VerifyEmailConfirmation />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
