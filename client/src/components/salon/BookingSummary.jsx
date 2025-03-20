import React from 'react';

const BookingSummary = ({ salon, selectedServices, selectedStylist, selectedDate, selectedTime, onPayNow }) => {
  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  
  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'long' })}`;
  };

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

      {selectedStylist && selectedDate && selectedTime && (
        <div className="mb-3 text-sm">
          <div className="font-medium">{selectedStylist.name} • {formatDate(selectedDate)} • {selectedTime}</div>
        </div>
      )}

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
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;