import React from 'react';

const CartSummary = ({ selectedServices, salon, onContinue }) => {
  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);

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

      {selectedServices.length > 0 ? (
        <>
          {selectedServices.map((service, index) => (
            <div key={`${service.type}-${service.id}-${index}`} className="py-3">
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
              onClick={onContinue}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <div className="py-6 text-center text-gray-500">
          <p>No services selected</p>
          <p className="text-sm mt-2">Select services to continue</p>
        </div>
      )}
    </div>
  );
};

export default CartSummary;