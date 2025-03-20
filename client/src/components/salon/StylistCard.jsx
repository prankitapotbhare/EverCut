import React from 'react';

const StylistCard = ({ stylist, isSelected, onSelect }) => {
  return (
    <div 
      className={`relative p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all ${
        isSelected ? 'bg-white shadow-md' : 'bg-gray-100 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(stylist)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full"></div>
      )}
      <img 
        src={stylist.image} 
        alt={stylist.name}
        className="w-16 h-16 rounded-full object-cover mb-2"
      />
      <span className="text-sm font-medium">{stylist.name}</span>
    </div>
  );
};

export default StylistCard;