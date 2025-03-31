import React, { useState, useEffect, useMemo } from 'react';
import SalonCard from './SalonCard';
import LocationSelector from '@/components/common/LocationSelector';
import Search from '@/components/common/Search';
import { useSalon } from '@/contexts/SalonContext';

const SalonFinder = () => {
  const [location, setLocation] = useState('New York, NY');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to New York coordinates

  const { 
    allSalons, 
    searchResults, 
    nearestSalons,
    loading, 
    searchLoading,
    error, 
    searchSalonsByQuery,
    fetchNearestSalons,
    clearSearchResults
  } = useSalon();

  // Fetch nearest salons on initial load
  useEffect(() => {
    if (coordinates) {
      fetchNearestSalons(coordinates);
    }
  }, []);

  // Handle search input change with real-time search
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      clearSearchResults();
    } else {
      searchSalonsByQuery(query);
    }
  };

  // Handle location change from LocationSelector
  const handleLocationChange = (newLocation, newCoordinates) => {
    setLocation(newLocation);
    
    // Only update coordinates and fetch if we have valid coordinates
    if (newCoordinates && newCoordinates.lat && newCoordinates.lng) {
      setCoordinates(newCoordinates);
      fetchNearestSalons(newCoordinates);
    }
  };

  // Determine which salons to display based on search state
  const displayedSalons = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return searchResults;
    } else if (coordinates && nearestSalons.length > 0) {
      return nearestSalons;
    } else {
      return allSalons;
    }
  }, [searchQuery, searchResults, coordinates, nearestSalons, allSalons]);

  // Apply pagination if not showing all
  const paginatedSalons = useMemo(() => {
    return showAll ? displayedSalons : displayedSalons.slice(0, 6);
  }, [displayedSalons, showAll]);

  if (loading && !searchLoading && displayedSalons.length === 0) {
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

        {/* Search Component */}
        <div className="relative max-w-2xl mx-auto mt-8">
          <Search 
            placeholder="Shop name or service"
            onSearch={handleSearchChange}
            initialValue={searchQuery}
            loading={searchLoading}
          />
        </div>

        {/* Location Selector Component */}
        <div className="mt-4">
          <LocationSelector 
            selectedLocation={location} 
            onLocationChange={handleLocationChange} 
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Salon Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedSalons.length > 0 ? (
          paginatedSalons.map((salon) => (
            <SalonCard 
              key={salon.id || salon._id} 
              salon={salon} 
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            {searchQuery ? 
              "No salons found matching your search. Try a different keyword." : 
              "No salons available in this area."}
          </div>
        )}
      </div>

      {/* Loading indicator for search results */}
      {searchLoading && displayedSalons.length === 0 && (
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Searching for salons...</p>
        </div>
      )}

      {/* See All Button */}
      {!showAll && displayedSalons.length > 6 && (
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