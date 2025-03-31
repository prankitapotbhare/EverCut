# Transitioning from Mock Data to API

This document outlines the process of transitioning from the current mock data implementation to the real backend API in the EverCut application.

## Current Mock Data Structure

The frontend currently uses mock data files located in `client/src/data/`:

- **mockSalons.js**: Contains salon information including services, gallery images, and other details
- **mockSalonists.js**: Contains stylist/salonist profiles with specializations
- **mockSchedules.js**: Contains availability schedules for stylists
- **mockLeaveSchedules.js**: Contains leave/time-off periods for stylists
- **mockBookings.js**: Contains booking data and helper functions

## Service Layer Implementation

The frontend also has service modules in `client/src/services/` that currently use this mock data:

- **salonService.js**: Methods for retrieving salon information
- **salonistService.js**: Methods for retrieving salonist profiles and availability
- **bookingService.js**: Methods for creating and managing bookings
- **schedulingService.js**: Utilities for managing time slots and availability
- **paymentService.js**: Methods for handling payment operations

## Transition Strategy

### Phase 1: Authentication Integration

1. Implement Firebase Auth and Firestore integration
2. Create AuthContext to manage authentication state
3. Build login, signup, and profile workflows

### Phase 2: API Client Layer

1. Create an API client with automatic authentication token handling
2. Implement API error handling and response parsing
3. Add environment configuration for API base URL

### Phase 3: Dual Implementation

During the transition, implement services with fallback to mock data:

```javascript
// Example dual implementation
export const getSalons = async (filters = {}, page = 1, limit = 20) => {
  try {
    // Try API first
    if (process.env.REACT_APP_USE_API === 'true') {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      return await apiClient(`/salons?${queryParams}`);
    }
  } catch (error) {
    console.warn('API request failed, falling back to mock data:', error);
    // Fall back to mock data if API fails or is not enabled
  }
  
  // Use mock data as fallback
  return getMockSalons(filters, page, limit);
};
```

### Phase 4: Service by Service Migration

1. Start with salon services (salon listing and details)
2. Move to salonist services (profiles and availability)
3. Implement booking services (creating and managing bookings)
4. Finally, add payment services (payment processing)

### Phase 5: Data Model Adaptation

MongoDB data models may differ from the mock data structure. Transform API responses to match the expected format in the frontend:

```javascript
// Example data transformation
const transformSalonData = (apiSalon) => {
  return {
    id: apiSalon._id,
    name: apiSalon.name,
    address: apiSalon.location.address,
    city: apiSalon.location.city,
    state: apiSalon.location.state,
    zip: apiSalon.location.zip,
    rating: apiSalon.rating,
    reviewCount: apiSalon.reviewCount,
    // Transform other fields...
    services: apiSalon.services.map(service => ({
      id: service._id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description
    })),
    // Add derived properties that may not exist in the API
    distance: '1.2 mi' // This would be calculated client-side or returned by the API
  };
};
```

### Phase 6: Testing and Validation

1. Create test cases for each migrated service
2. Compare API responses with mock data for consistency
3. Verify error handling and edge cases

### Phase 7: Cleanup

1. Remove feature flags for using mock data
2. Maintain mock data files temporarily for testing
3. Eventually remove mock data files when API integration is stable

## Mapping Between Mock and API Data

| Mock Data File | API Endpoint(s) | MongoDB Collection |
|---------------|-----------------|-------------------|
| mockSalons.js | GET /api/v1/salons | salons |
| mockSalonists.js | GET /api/v1/salons/:salonId/salonists | salonists |
| mockSchedules.js | GET /api/v1/salonists/:salonistId/availability | salonists (availability field) |
| mockLeaveSchedules.js | N/A (internal to availability calculation) | leaves |
| mockBookings.js | GET /api/v1/bookings | bookings |

## Testing API Integration

To verify the API integration:

1. Enable API integration for a specific feature
2. Test with the actual backend running
3. Test with backend not available (should fall back to mock data)
4. Verify error handling works correctly

## Deployment Considerations

1. Deploy backend first and verify it's functional
2. Deploy frontend with feature flags to enable API integration gradually
3. Monitor for errors and performance issues
4. Gradually increase the percentage of users getting the API version