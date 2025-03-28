import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import SalonCard from './SalonCard';
import LocationSelector from '../common/LocationSelector';
import { useSalon } from '@/contexts/SalonContext';

const SalonFinder = () => {
  const [location, setLocation] = useState('Munich Center');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  const { allSalons, loading: contextLoading, error: contextError } = useSalon();

  // This effect sets salons once allSalons is available
  useEffect(() => {
    if (allSalons.length > 0) {
      setSalons(allSalons);
      setLoading(false);
    }
  }, [allSalons]);

  // Handle location change from LocationSelector
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  // Optionally, detect location automatically on mount
  useEffect(() => {
    // This will be handled by the LocationSelector component
  }, []);

  const filteredSalons = useMemo(() => {
    const filtered = salons.filter(salon =>
      salon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return showAll ? filtered : filtered.slice(0, 6);
  }, [salons, searchQuery, showAll]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f0ff] p-8 flex items-center justify-center">
        <div className="text-xl">Loading salons...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f0ff] p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold mb-2">
          We're here to bring out<br />
          your best <span className="text-emerald-400">look</span>.
        </h1>

        {/* Description */}
        <p className="text-md md:text-lg text-gray-600 mb-8 max-w-md md:max-w-xl lg:max-w-2xl text-center mx-auto">
          Seamless booking, smooth management, and a hassle-free salon experience—all in one powerful app. Stay ahead with Evercut!
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mt-8">
          <input
            type="text"
            placeholder="Shop name or service"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-full shadow-lg text-lg"
          />
          <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Location Selector Component */}
        <div className="mt-4">
          <LocationSelector 
            selectedLocation={location} 
            onLocationChange={handleLocationChange} 
          />
        </div>
      </div>

      {/* Salon Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalons.map((salon) => (
          <SalonCard 
            key={salon.id} 
            salon={salon} 
          />
        ))}
      </div>

      {/* See All Button */}
      {!showAll && filteredSalons.length === 6 && salons.length > 6 && (
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <button 
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
          >
            See all salons →
          </button>
        </div>
      )}
    </div>
  );
};

export default SalonFinder;