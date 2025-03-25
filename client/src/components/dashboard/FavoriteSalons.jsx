import React, { useEffect } from 'react';
import { Heart, MapPin, Star, ChevronRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const FavoriteSalons = () => {
  const { favoriteSalons, loading, error, removeSalonFromFavorites, refreshUserData } = useUser();

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await removeSalonFromFavorites(id);
      // Favorites list will be updated automatically through context
    } catch (err) {
      console.error('Error removing salon from favorites:', err);
      // Handle error (could show a toast notification here)
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="text-red-500">
          <p>Error loading favorite salons: {error}</p>
          <button 
            onClick={refreshUserData}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Favorite Salons</h2>
        <p className="text-gray-600 mt-1">Your saved salons for quick access</p>
      </div>

      {/* Salon List */}
      <div className="divide-y divide-gray-200">
        {favoriteSalons.length > 0 ? (
          favoriteSalons.map((salon) => (
            <div key={salon.id} className="p-6 flex flex-col md:flex-row">
              {/* Salon Image */}
              <div className="w-full md:w-1/4 h-48 md:h-32 rounded-lg overflow-hidden mb-4 md:mb-0">
                <img 
                  src={salon.imageUrl} 
                  alt={salon.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Salon Details */}
              <div className="md:ml-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{salon.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    {salon.address}
                  </div>
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-700">{salon.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{salon.reviewCount} reviews</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => removeFavorite(salon.id)}
                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    <Heart className="mr-1.5 h-4 w-4 fill-current" />
                    Remove from favorites
                  </button>
                  
                  <button className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    Book now
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No favorite salons</h3>
            <p className="mt-1 text-sm text-gray-500">Start adding salons to your favorites for quick access.</p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Explore Salons
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteSalons;