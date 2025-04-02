import React from 'react';
import { useBooking } from '@/contexts/BookingContext';

const BookingSummary = ({ salon, selectedServices, selectedStylist, selectedDate, selectedTime, onPayNow }) => {
  const { calculateTotalPrice, formatDate } = useBooking();
  
  const total = calculateTotalPrice(selectedServices);
  
  // Check if all required selections are made
  const isBookingComplete = selectedStylist && selectedDate && selectedTime;
  
  // Use the formatDate function from our context
  const formattedDate = selectedDate ? formatDate(selectedDate, { weekday: 'long' }) : '';

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <div className="mb-4">
        <img 
          src={salon.image} 
          alt={salon.name}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
        <h3 className="text-xl font-bold">{salon.name}</h3>
        <p className="text-sm text-gray-600">{salon.address}</p>
      </div>

      {/* Show selected details or prompt for selection */}
      <div className="mb-3 text-sm">
        {selectedStylist ? (
          <div className="font-medium">
            {selectedStylist.name} {selectedDate ? `• ${formattedDate}` : ''} {selectedTime ? `• ${selectedTime}` : ''}
          </div>
        ) : (
          <div className="text-amber-600 font-medium">Please select a stylist</div>
        )}
        
        {selectedStylist && !selectedDate && (
          <div className="text-amber-600 font-medium mt-1">Please select a date</div>
        )}
        
        {selectedStylist && selectedDate && !selectedTime && (
          <div className="text-amber-600 font-medium mt-1">Please select a time</div>
        )}
      </div>

      {selectedServices.map((service, index) => (
        <div key={index} className="py-3">
          <div className="flex justify-between font-medium">
            <span>{service.name}</span>
            <span>{service.price} ₹</span>
          </div>
          <div className="text-sm text-gray-600">{service.duration}</div>
        </div>
      ))}

      <div className="border-t border-gray-200 mt-2 pt-3">
        <div className="flex justify-between font-bold mb-4">
          <span>Total</span>
          <span>{total} ₹</span>
        </div>
        <button 
          onClick={onPayNow}
          disabled={!isBookingComplete}
          className={`w-full py-3 rounded-lg font-medium ${
            isBookingComplete 
              ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;