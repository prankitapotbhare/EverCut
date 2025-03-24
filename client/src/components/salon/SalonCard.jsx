import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';

const SalonCard = ({ salon }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/salon/${salon.id}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img 
          src={salon.image} 
          alt={salon.name}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md cursor-pointer">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{salon.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span>{salon.distance} km</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xs">♀️</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs">♂️</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span className="font-medium">{salon.rating}</span>
            <span className="text-gray-500 text-sm">({salon.reviews} ratings)</span>
          </div>
          <button 
            onClick={handleBookNow}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;