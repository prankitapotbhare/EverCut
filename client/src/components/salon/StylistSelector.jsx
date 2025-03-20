import React from 'react';

const StylistSelector = ({ stylists, selectedStylist, onStylistSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select your Salonist!</h2>
      <div className="grid grid-cols-2 gap-4">
        {stylists.map(stylist => (
          <div 
            key={stylist.id}
            className={`relative bg-gray-100 rounded-lg p-4 flex flex-col items-center cursor-pointer ${
              selectedStylist?.id === stylist.id ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => onStylistSelect(stylist)}
          >
            {selectedStylist?.id === stylist.id && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full"></div>
            )}
            <img 
              src={stylist.image} 
              alt={stylist.name}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
            <span className="text-sm font-medium">{stylist.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StylistSelector;