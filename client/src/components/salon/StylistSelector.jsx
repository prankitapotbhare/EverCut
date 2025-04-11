import React, { useMemo, useEffect } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { Users, User, AlertCircle } from 'lucide-react';

const StylistSelector = ({ stylists, selectedStylist, onStylistSelect, availableStylists = [], selectedDate }) => {
  const { getStylistAvailabilityStatus, loadingData } = useBooking();
  
  // If no stylist is selected but there are available stylists, auto-select the first one
  useEffect(() => {
    if (!selectedStylist && availableStylists.length > 0 && !loadingData.availableSalonists) {
      onStylistSelect(availableStylists[0]);
    }
  }, [selectedStylist, availableStylists, onStylistSelect, loadingData.availableSalonists]);

  const stylistsWithAvailability = useMemo(() => {
    if (!stylists || stylists.length === 0) {
      return [];
    }
  
    return stylists.map(stylist => {
      const isAvailable = availableStylists.length === 0 || 
        availableStylists.some(s => s.id === stylist.id);
      
      try {
        const { status, reason } = getStylistAvailabilityStatus(stylist, isAvailable, selectedDate);
        
        return {
          ...stylist,
          isAvailable,
          availabilityStatus: status,
          availabilityReason: reason
        };
      } catch (error) {
        console.error(`Error getting availability for stylist ${stylist.id}:`, error);
        return {
          ...stylist,
          isAvailable: false,
          availabilityStatus: 'Error',
          availabilityReason: 'Error fetching availability'
        };
      }
    });
  }, [stylists, availableStylists, selectedDate, getStylistAvailabilityStatus]);

  const hasAvailableStylists = useMemo(() => {
    return stylistsWithAvailability.some(stylist => stylist.isAvailable);
  }, [stylistsWithAvailability]);

  return (
    <div className="stylist-selector">
      <div className="flex items-center mb-2">
        <Users size={18} className="text-blue-600 mr-2" />
        <h2 className="text-xl font-bold">Select your Salonist!</h2>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start">
        <User size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          {selectedStylist ? (
            <>
              <span className="font-medium">Selected:</span> {selectedStylist.name}
            </>
          ) : (
            'Please select a stylist to continue'
          )}
        </p>
      </div>
      
      {loadingData.availableSalonists ? (
        <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
          <div className="flex justify-center items-center h-16">
            <p className="text-gray-500">Loading stylists availability...</p>
          </div>
        </div>
      ) : stylistsWithAvailability.length === 0 ? (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">No stylists found</p>
        </div>
      ) : !hasAvailableStylists && availableStylists.length > 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle size={16} className="text-amber-500 mr-2" />
            <p className="text-amber-600 font-medium">No stylists available for the selected date</p>
          </div>
          <p className="text-sm text-gray-600 ml-6">Please try another date</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {stylistsWithAvailability.map(stylist => {
            const { isAvailable, availabilityStatus, availabilityReason } = stylist;
            const isSelected = selectedStylist?.id === stylist.id;

            let statusColor = '';
            let statusBgColor = '';
            let statusBorder = '';
            let statusText = '';
            
            switch(availabilityStatus) {
              case 'available':
                statusColor = 'text-green-600';
                statusBgColor = 'bg-green-50';
                statusBorder = 'border-green-200';
                statusText = 'Available';
                break;
              case 'on-leave':
                statusColor = 'text-amber-600';
                statusBgColor = 'bg-amber-50';
                statusBorder = 'border-amber-200';
                statusText = 'On Leave';
                break;
              case 'partial-leave':
                statusColor = 'text-blue-600';
                statusBgColor = 'bg-blue-50';
                statusBorder = 'border-blue-200';
                statusText = 'Partially Available';
                break;
              case 'partially-booked':
                statusColor = 'text-purple-600';
                statusBgColor = 'bg-purple-50';
                statusBorder = 'border-purple-200';
                statusText = 'Partially Booked';
                break;
              case 'mostly-booked':
                statusColor = 'text-orange-600';
                statusBgColor = 'bg-orange-50';
                statusBorder = 'border-orange-200';
                statusText = 'Mostly Booked';
                break;
              case 'booked':
                statusColor = 'text-red-600';
                statusBgColor = 'bg-red-50';
                statusBorder = 'border-red-200';
                statusText = 'Fully Booked';
                break;
              default:
                statusColor = 'text-red-600';
                statusBgColor = 'bg-red-50';
                statusBorder = 'border-red-200';
                statusText = 'Unavailable'
            }
            
            return (
              <div 
                key={stylist.id}
                className={`relative bg-gray-100 rounded-lg p-2 flex flex-col items-center ${isAvailable ? 'cursor-pointer hover:bg-gray-200' : 'cursor-not-allowed'} transition-all ${
                  isSelected
                    ? 'ring-2 ring-green-500 bg-green-50 transform scale-105' 
                    : availableStylists.length > 0
                      ? `${statusBgColor} border ${statusBorder}`
                      : ''
                }`}
                onClick={() => {
                  if (isAvailable) {
                    onStylistSelect(stylist);
                  }
                }}
                aria-label={`Select ${stylist.name}${!isAvailable ? ' (unavailable)' : ''}`}
              >
                <img 
                  src={stylist.image} 
                  alt={stylist.name}
                  className={`w-16 h-16 rounded-full object-cover mb-2 ${
                    availableStylists.length > 0 && !isAvailable
                      ? 'opacity-50 grayscale'
                      : ''
                  }`}
                />
                <span className="text-sm font-medium">{stylist.name}</span>
                {availableStylists.length > 0 && (
                  <span className={`text-xs ${statusColor} mt-1`}>{statusText}</span>
                )}
                {availabilityReason && (
                  <span className="text-xs text-center text-gray-500 mt-0.5 line-clamp-2">{availabilityReason}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StylistSelector;