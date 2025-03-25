import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getAppointments,
  getUpcomingAppointments,
  getPastAppointments,
  getAppointmentById,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment
} from '@/services/appointmentService';

const AppointmentContext = createContext();

export const useAppointment = () => {
  return useContext(AppointmentContext);
};

export const AppointmentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments when user changes
  useEffect(() => {
    if (currentUser) {
      fetchAppointments();
    } else {
      // Reset state when user logs out
      setAppointments({ upcoming: [], past: [] });
      setCurrentAppointment(null);
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch all appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const appointmentsData = await getAppointments();
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific appointment by ID
  const fetchAppointmentById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const appointmentData = await getAppointmentById(id);
      setCurrentAppointment(appointmentData);
      return appointmentData;
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      setError('Failed to load appointment details. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Book a new appointment
  const createAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bookAppointment(appointmentData);
      if (result.success) {
        // Update the appointments list with the new appointment
        setAppointments(prev => ({
          ...prev,
          upcoming: [...prev.upcoming, result.appointment]
        }));
      }
      return result;
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel an appointment
  const cancelUserAppointment = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cancelAppointment(id);
      if (result.success) {
        // Update the appointments list
        setAppointments(prev => {
          const updatedUpcoming = prev.upcoming.filter(appt => appt.id !== id);
          const updatedPast = prev.past.map(appt => 
            appt.id === id ? { ...appt, status: 'cancelled' } : appt
          );
          
          return {
            upcoming: updatedUpcoming,
            past: updatedPast
          };
        });
      }
      return result;
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reschedule an appointment
  const rescheduleUserAppointment = async (id, newDate, newTime) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await rescheduleAppointment(id, newDate, newTime);
      if (result.success) {
        // Update the appointments list
        setAppointments(prev => {
          const updatedUpcoming = prev.upcoming.map(appt => 
            appt.id === id ? result.appointment : appt
          );
          
          return {
            ...prev,
            upcoming: updatedUpcoming
          };
        });
      }
      return result;
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      setError('Failed to reschedule appointment. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh appointments data
  const refreshAppointments = () => {
    return fetchAppointments();
  };

  const value = {
    appointments,
    currentAppointment,
    loading,
    error,
    fetchAppointmentById,
    createAppointment,
    cancelUserAppointment,
    rescheduleUserAppointment,
    refreshAppointments
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};