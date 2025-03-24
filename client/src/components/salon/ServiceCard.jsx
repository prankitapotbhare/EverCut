import React from 'react';

const ServiceCard = ({ service, onSelect, isSelected }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div className="flex-1">
        <h3 className="font-medium">{service.name}</h3>
        {service.description && (
          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
        )}
        <div className="text-sm text-gray-500">{service.duration}</div>
        {service.services && (
          <div className="flex flex-wrap gap-1 mt-1">
            {service.services.map((item, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="font-medium">{service.price} ₹</span>
        <button 
          onClick={() => onSelect(service)}
          className={`px-3 py-1 rounded text-sm cursor-pointer ${
            isSelected 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;