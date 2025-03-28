import React from 'react';

const StylistSelector = ({ stylists, selectedStylist, onStylistSelect, availableStylists = [] }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Select your Salonist!</h2>
      <p className="text-sm text-gray-600 mb-4">
        {selectedStylist ? 
          `You selected ${selectedStylist.name}` : 
          'Please select a stylist to continue'}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {stylists.map(stylist => {
          const isAvailable = availableStylists.length === 0 || availableStylists.some(s => s.id === stylist.id);
          const isSelected = selectedStylist?.id === stylist.id;
          
          return (
            <div 
              key={stylist.id}
              className={`relative bg-gray-100 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-gray-200 ${
                isSelected
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : availableStylists.length > 0 && isAvailable
                    ? 'bg-green-50 border border-green-200'
                    : availableStylists.length > 0 && !isAvailable
                      ? 'bg-red-50 border border-red-200'
                      : ''
              }`}
              onClick={() => onStylistSelect(stylist)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full"></div>
              )}
              {availableStylists.length > 0 && isAvailable && !isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full"></div>
              )}
              {availableStylists.length > 0 && !isAvailable && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <img 
                src={stylist.image} 
                alt={stylist.name}
                className={`w-16 h-16 rounded-full object-cover mb-2 ${
                  availableStylists.length > 0 && !isAvailable && !isSelected
                    ? 'opacity-70'
                    : ''
                }`}
              />
              <span className="text-sm font-medium">{stylist.name}</span>
              {availableStylists.length > 0 && isAvailable && (
                <span className="text-xs text-green-600 mt-1">Available</span>
              )}
              {availableStylists.length > 0 && !isAvailable && (
                <span className="text-xs text-red-600 mt-1">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StylistSelector;