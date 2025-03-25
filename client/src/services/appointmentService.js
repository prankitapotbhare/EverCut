// Mock appointment service to simulate API calls for appointment-related operations

// Mock data for appointments
const mockAppointments = {
  upcoming: [
    {
      id: 1,
      salonName: 'Evercut Salon & Spa',
      salonAddress: '123 Main St, Munich',
      stylistName: 'Emma Johnson',
      date: '2023-12-15',
      time: '10:00 AM',
      services: ['Haircut', 'Beard Trim'],
      totalPrice: 45.00,
      status: 'confirmed'
    },
    {
      id: 2,
      salonName: 'Modern Cuts',
      salonAddress: '456 Oak Ave, Munich',
      stylistName: 'Michael Chen',
      date: '2023-12-22',
      time: '2:30 PM',
      services: ['Hair Coloring', 'Style'],
      totalPrice: 85.00,
      status: 'pending'
    }
  ],
  past: [
    {
      id: 3,
      salonName: 'Evercut Salon & Spa',
      salonAddress: '123 Main St, Munich',
      stylistName: 'Emma Johnson',
      date: '2023-11-10',
      time: '11:00 AM',
      services: ['Haircut'],
      totalPrice: 30.00,
      status: 'completed'
    },
    {
      id: 4,
      salonName: 'Style Studio',
      salonAddress: '789 Pine Blvd, Munich',
      stylistName: 'Sarah Miller',
      date: '2023-10-05',
      time: '3:00 PM',
      services: ['Beard Trim', 'Facial'],
      totalPrice: 50.00,
      status: 'completed'
    },
    {
      id: 5,
      salonName: 'Modern Cuts',
      salonAddress: '456 Oak Ave, Munich',
      stylistName: 'Michael Chen',
      date: '2023-09-20',
      time: '1:00 PM',
      services: ['Haircut', 'Shampoo'],
      totalPrice: 40.00,
      status: 'cancelled'
    }
  ]
};

// Get all appointments
export const getAppointments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAppointments);
    }, 300); // Simulate network delay
  });
};

// Get upcoming appointments
export const getUpcomingAppointments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAppointments.upcoming);
    }, 300);
  });
};

// Get past appointments
export const getPastAppointments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAppointments.past);
    }, 300);
  });
};

// Get appointment by ID
export const getAppointmentById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allAppointments = [...mockAppointments.upcoming, ...mockAppointments.past];
      const appointment = allAppointments.find(appt => appt.id === id);
      if (appointment) {
        resolve(appointment);
      } else {
        reject(new Error('Appointment not found'));
      }
    }, 300);
  });
};

// Book a new appointment
export const bookAppointment = (appointmentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would send the data to a server
      // Here we just simulate a successful booking
      const newAppointment = {
        id: Math.floor(Math.random() * 1000) + 10, // Generate a random ID
        ...appointmentData,
        status: 'pending'
      };
      
      // In a real app, this would be added to the database
      resolve({
        success: true,
        message: 'Appointment booked successfully',
        appointment: newAppointment
      });
    }, 500);
  });
};

// Cancel an appointment
export const cancelAppointment = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allAppointments = [...mockAppointments.upcoming, ...mockAppointments.past];
      const appointment = allAppointments.find(appt => appt.id === id);
      
      if (!appointment) {
        reject(new Error('Appointment not found'));
        return;
      }
      
      if (appointment.status === 'completed') {
        reject(new Error('Cannot cancel a completed appointment'));
        return;
      }
      
      // In a real app, this would update the database
      resolve({
        success: true,
        message: 'Appointment cancelled successfully'
      });
    }, 500);
  });
};

// Reschedule an appointment
export const rescheduleAppointment = (id, newDate, newTime) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allAppointments = [...mockAppointments.upcoming, ...mockAppointments.past];
      const appointment = allAppointments.find(appt => appt.id === id);
      
      if (!appointment) {
        reject(new Error('Appointment not found'));
        return;
      }
      
      if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        reject(new Error(`Cannot reschedule a ${appointment.status} appointment`));
        return;
      }
      
      // In a real app, this would update the database
      const updatedAppointment = {
        ...appointment,
        date: newDate,
        time: newTime
      };
      
      resolve({
        success: true,
        message: 'Appointment rescheduled successfully',
        appointment: updatedAppointment
      });
    }, 500);
  });
};