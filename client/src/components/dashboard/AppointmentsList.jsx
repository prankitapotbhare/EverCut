import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppointment } from '@/contexts/AppointmentContext';

const AppointmentsList = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const { appointments, loading, error, cancelUserAppointment, rescheduleUserAppointment, refreshAppointments } = useAppointment();

  // Refresh appointments when component mounts
  useEffect(() => {
    refreshAppointments();
  }, []);

  const toggleAppointmentDetails = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (id) => {
    try {
      await cancelUserAppointment(id);
      // Appointment list will be updated automatically through context
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      // Handle error (could show a toast notification here)
    }
  };

  // Handle appointment rescheduling (simplified for demo)
  const handleRescheduleAppointment = async (id) => {
    // In a real app, this would open a modal to select new date/time
    // For this demo, we'll just use hardcoded values
    const newDate = '2023-12-30';
    const newTime = '11:00 AM';
    
    try {
      await rescheduleUserAppointment(id, newDate, newTime);
      // Appointment list will be updated automatically through context
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      // Handle error (could show a toast notification here)
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="text-red-500">
          <p>Error loading appointments: {error}</p>
          <button 
            onClick={refreshAppointments}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>
        <p className="text-gray-600 mt-1">View and manage your salon appointments</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'upcoming' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'past' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>

      {/* Appointment List */}
      <div className="divide-y divide-gray-200">
        {appointments[activeTab]?.length > 0 ? (
          appointments[activeTab].map((appointment) => (
            <div key={appointment.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{appointment.salonName}</h3>
                    <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {formatDate(appointment.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {appointment.salonAddress}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {appointment.stylistName}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className="text-lg font-medium text-gray-900">
                    €{appointment.totalPrice.toFixed(2)}
                  </div>
                  <button
                    onClick={() => toggleAppointmentDetails(appointment.id)}
                    className="mt-2 flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    {expandedAppointment === appointment.id ? (
                      <>
                        Hide details <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View details <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Expanded details */}
              {expandedAppointment === appointment.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Services</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {appointment.services.map((service, index) => (
                      <li key={index} className="py-2 flex justify-between">
                        <span className="text-sm text-gray-600">{service}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {activeTab === 'upcoming' && (
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => handleRescheduleAppointment(appointment.id)}
                        className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  
                  {activeTab === 'past' && appointment.status === 'completed' && (
                    <div className="mt-6">
                      <button className="w-full bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        Book Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;