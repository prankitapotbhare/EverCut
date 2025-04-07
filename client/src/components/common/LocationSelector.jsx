import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, ChevronDown, Loader, Check, X, Search } from 'lucide-react';

const LocationSelector = ({ selectedLocation, onLocationChange }) => {
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const locationSearchRef = useRef(null);
  
  // Extended list of locations for selection and search
  const allLocations = [
    'New York, NY', 
    'Los Angeles, CA', 
    'Chicago, IL', 
    'Houston, TX', 
    'Phoenix, AZ', 
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA'
  ];

  // Map of locations to coordinates
  const locationCoordinates = {
    'New York, NY': { lat: 40.7128, lng: -74.0060 },
    'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
    'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
    'Houston, TX': { lat: 29.7604, lng: -95.3698 },
    'Phoenix, AZ': { lat: 33.4484, lng: -112.0740 },
    'Philadelphia, PA': { lat: 39.9526, lng: -75.1652 },
    'San Antonio, TX': { lat: 29.4241, lng: -98.4936 },
    'San Diego, CA': { lat: 32.7157, lng: -117.1611 },
    'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
    'San Jose, CA': { lat: 37.3382, lng: -121.8863 }
  };

  // Popular locations (subset of all locations)
  const popularLocations = allLocations.slice(0, 6);

  // Filtered locations based on search query
  const filteredLocations = useMemo(() => {
    if (!locationSearchQuery) return [];
    
    return allLocations.filter(loc => 
      loc.toLowerCase().includes(locationSearchQuery.toLowerCase())
    ).slice(0, 8); // Limit to 8 results
  }, [locationSearchQuery, allLocations]);

  // Auto-detect location when component mounts only if no saved location
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedCoordinates = localStorage.getItem('userCoordinates');
    
    if (savedLocation && savedCoordinates) {
      // Use saved location and coordinates
      onLocationChange(savedLocation, JSON.parse(savedCoordinates));
    } else if (selectedLocation === 'New York, NY') {
      // Only auto-detect if we don't have a saved location and are using the default
      detectLocation();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
        setLocationSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (showLocationDropdown && locationSearchRef.current) {
      locationSearchRef.current.focus();
    }
  }, [showLocationDropdown]);

  // Function to detect the user's location and update the city name
  const detectLocation = () => {
    setDetectingLocation(true);
    setShowLocationDropdown(false);
    setLocationSearchQuery('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            // Check for different keys that may contain the city name
            if (data.address) {
              let cityName = "Unknown Location";
              if (data.address.city) {
                cityName = data.address.city;
              } else if (data.address.town) {
                cityName = data.address.town;
              } else if (data.address.village) {
                cityName = data.address.village;
              }
              
              const coordinates = { lat: latitude, lng: longitude };
              
              // Save to localStorage
              localStorage.setItem('userLocation', cityName);
              localStorage.setItem('userCoordinates', JSON.stringify(coordinates));
              
              // Pass both the city name and coordinates to the parent component
              onLocationChange(cityName, coordinates);
            }
            setDetectingLocation(false);
          } catch (error) {
            console.error('Error fetching location data:', error);
            setDetectingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setDetectingLocation(false);
        },
        // Add options for better user experience
        { 
          timeout: 10000,         // 10 seconds timeout
          maximumAge: 60 * 60000, // Cache location for 1 hour
          enableHighAccuracy: false // Don't need high accuracy for city-level detection
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setDetectingLocation(false);
    }
  };

  // Function to select a location from the dropdown
  const selectLocation = (loc) => {
    const coordinates = locationCoordinates[loc];
    
    // Save to localStorage
    localStorage.setItem('userLocation', loc);
    localStorage.setItem('userCoordinates', JSON.stringify(coordinates));
    
    // Pass both the location name and its coordinates to the parent component
    onLocationChange(loc, coordinates);
    setShowLocationDropdown(false);
    setLocationSearchQuery('');
  };

  return (
    <div className="relative inline-block w-full sm:w-auto" ref={dropdownRef}>
      <button 
        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
        className={`flex items-center gap-2 w-full sm:w-auto mx-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-full 
          ${detectingLocation ? 'bg-purple-100 text-purple-700 animate-pulse' : ''} 
          transition-all duration-300 cursor-pointer border-2 
          ${detectingLocation ? 'border-purple-300' : 'border-transparent hover:border-purple-200'}`}
      >
        {detectingLocation ? (
          <div className="flex items-center justify-center w-full">
            <Loader size={18} className="animate-spin text-purple-500 mr-2" />
            <span className="font-medium text-sm sm:text-base">Finding your location...</span>
          </div>
        ) : (
          <>
            <MapPin size={18} className="text-purple-500 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base truncate flex-grow">{selectedLocation}</span>
            <ChevronDown size={18} className={`text-purple-400 transition-transform duration-300 flex-shrink-0 ${showLocationDropdown ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
      
      {/* Location Dropdown with Search */}
      {showLocationDropdown && (
        <div className="absolute z-10 mt-2 w-full sm:w-72 left-0 right-0 sm:left-auto sm:right-auto bg-white rounded-xl shadow-xl border border-purple-100 py-2 animate-fadeIn">
          <div className="px-3 sm:px-4 py-2 border-b border-purple-100">
            <p className="text-xs sm:text-sm font-medium text-purple-700 mb-2">Select a location</p>
            
            {/* Location Search Input */}
            <div className="relative">
              <input
                ref={locationSearchRef}
                type="text"
                placeholder="Search for a location..."
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 pr-8 rounded-lg border border-purple-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
              {locationSearchQuery ? (
                <button 
                  onClick={() => setLocationSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} className="sm:w-4 sm:h-4" />
                </button>
              ) : (
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </div>
          </div>
          
          {/* Auto-detect option */}
          <button 
            onClick={detectLocation}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-purple-50 flex items-center gap-2 transition-colors"
          >
            <MapPin size={16} className="text-purple-500 sm:w-[18px] sm:h-[18px]" />
            <span className="text-xs sm:text-sm">Auto-detect my location</span>
          </button>
          
          {/* Search Results */}
          {locationSearchQuery && filteredLocations.length > 0 && (
            <div className="px-3 sm:px-4 py-2 border-t border-purple-100">
              <p className="text-xs text-gray-500 mb-1">Search results</p>
              <div className="max-h-48 sm:max-h-60 overflow-y-auto">
                {filteredLocations.map((loc) => (
                  <button 
                    key={loc}
                    onClick={() => selectLocation(loc)}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left hover:bg-purple-50 flex items-center gap-2 transition-colors"
                  >
                    {selectedLocation === loc && <Check size={14} className="text-purple-500 sm:w-4 sm:h-4" />}
                    <span className={`text-xs sm:text-sm ${selectedLocation === loc ? "text-purple-700 font-medium" : ""}`}>{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* No Results Message */}
          {locationSearchQuery && filteredLocations.length === 0 && (
            <div className="px-3 sm:px-4 py-3 text-center text-gray-500 italic text-xs sm:text-sm">
              No locations found. Try a different search.
            </div>
          )}
          
          {/* Popular locations (shown when no search query) */}
          {!locationSearchQuery && (
            <div className="px-3 sm:px-4 py-2 border-t border-purple-100">
              <p className="text-xs text-gray-500 mb-1">Popular locations</p>
              <div className="max-h-48 sm:max-h-60 overflow-y-auto">
                {popularLocations.map((loc) => (
                  <button 
                    key={loc}
                    onClick={() => selectLocation(loc)}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left hover:bg-purple-50 flex items-center gap-2 transition-colors"
                  >
                    {selectedLocation === loc && <Check size={14} className="text-purple-500 sm:w-4 sm:h-4" />}
                    <span className={`text-xs sm:text-sm ${selectedLocation === loc ? "text-purple-700 font-medium" : ""}`}>{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;