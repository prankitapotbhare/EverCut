import React, { useMemo } from 'react';
import { useBooking } from '@/contexts/BookingContext';

const StylistSelector = ({ stylists, selectedStylist, onStylistSelect, availableStylists = [], selectedDate }) => {
  const { getStylistAvailabilityStatus } = useBooking();
  
  // Use memoization to prevent unnecessary recalculations of stylist availability
  const stylistsWithAvailability = useMemo(() => {
    if (!stylists || stylists.length === 0) {
      return [];
    }
  
    return stylists.map(stylist => {
      // Only consider a stylist available if they're in the availableStylists array
      // If availableStylists is empty, all stylists are considered available
      const isAvailable = availableStylists.length === 0 || 
        availableStylists.some(s => s.id === stylist.id);
      
      try {
        // Get detailed availability status using the context function
        const { status } = getStylistAvailabilityStatus(stylist, isAvailable, selectedDate);
        
        return {
          ...stylist,
          isAvailable,
          availabilityStatus: status
        };
      } catch (error) {
        console.error(`Error getting availability for stylist ${stylist.id}:`, error);
        return {
          ...stylist,
          isAvailable: false,
          availabilityStatus: 'Error'
        };
      }
    });
  }, [stylists, availableStylists, selectedDate, getStylistAvailabilityStatus]);

  // Handle the case when no stylists are available
  const hasAvailableStylists = useMemo(() => {
    return stylistsWithAvailability.some(stylist => stylist.isAvailable);
  }, [stylistsWithAvailability]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Select your Salonist!</h2>
      <p className="text-sm text-gray-600 mb-4">
        {selectedStylist ? 
          `You selected ${selectedStylist.name}` : 
          'Please select a stylist to continue'}
      </p>
      
      {stylistsWithAvailability.length === 0 ? (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">No stylists found</p>
        </div>
      ) : !hasAvailableStylists && availableStylists.length > 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-amber-600">No stylists available for the selected date</p>
          <p className="text-sm text-gray-600 mt-1">Please try another date</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {stylistsWithAvailability.map(stylist => {
            const { isAvailable, availabilityStatus, availabilityReason } = stylist;
            const isSelected = selectedStylist?.id === stylist.id;
            
            // Determine styling based on availability status
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
                className={`relative bg-gray-100 rounded-lg p-4 flex flex-col items-center ${isAvailable ? 'cursor-pointer hover:bg-gray-200' : 'cursor-not-allowed'} transition-all ${
                  isSelected
                    ? 'ring-2 ring-green-500 bg-green-50' 
                    : availableStylists.length > 0
                      ? `${statusBgColor} border ${statusBorder}`
                      : ''
                }`}
                onClick={() => {
                  // Only allow selection if stylist is available
                  if (isAvailable) {
                    onStylistSelect(stylist);
                  }
                }}
                aria-label={`Select ${stylist.name}${!isAvailable ? ' (unavailable)' : ''}`}
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
                  <span className="text-xs text-gray-500 mt-0.5">{availabilityReason}</span>
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