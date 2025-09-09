import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SalonProvider } from '@/contexts/SalonContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { BookingProvider } from '@/contexts/BookingContext';
import Home from '@/pages/Home';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import ErrorHandler from '@/components/error/ErrorHandler';
import { useState } from 'react';
import SalonDetailPage from '@/pages/salon/SalonDetailPage';
import BookingPage from '@/pages/salon/BookingPage';

function AppRoutes() {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    setError(error);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <Router>
      <ErrorHandler error={error} onClose={() => setError(null)} />
      <Routes>
        {/* Salon Routes - Now publicly accessible */}
        <Route path="/salon/:id" element={<SalonDetailPage />} />
        
        {/* Booking Route - Now publicly accessible */}
        <Route path="/salon/:id/booking" element={<BookingPage />} />

        {/* Home Route */}
        <Route 
          path="/"
          element={<Home onError={handleError} />} 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <SalonProvider>
        <PaymentProvider>
          <BookingProvider>
            <AppRoutes />
          </BookingProvider>
        </PaymentProvider>
      </SalonProvider>
    </ErrorBoundary>
  );
}

export default App;
