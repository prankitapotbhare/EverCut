import mockSalons from '../data/mockSalons';

// Simulate API calls
export const getSalons = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSalons);
    }, 300); // Simulate network delay
  });
};

export const getSalonById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const salon = mockSalons.find(salon => salon.id === id);
      if (salon) {
        resolve(salon);
      } else {
        reject(new Error('Salon not found'));
      }
    }, 300);
  });
};

// Additional service functions
export const getPopularSalons = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sort by rating and reviews to get the most popular salons
      const popular = [...mockSalons]
        .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
        .slice(0, 10);
      resolve(popular);
    }, 300);
  });
};

export const getNearestSalons = (userLocation) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sort by distance to get the nearest salons
      const nearest = [...mockSalons]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
      resolve(nearest);
    }, 300);
  });
};

export const searchSalons = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockSalons.filter(salon => 
        salon.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 300);
  });
};