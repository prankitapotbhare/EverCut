// Mock data for salon services and packages
export const mockSalon = {
  id: 1,
  name: "Beauty Loft Salon",
  image: "/images/salon/beauty-loft.jpg",
  address: "Pillar number 106, opposite to corner bar address maker, Bengaluru, Karnataka 560008",
  services: [
    { id: 1, name: "Hair Cut", duration: "1 hr", price: 100 },
    { id: 2, name: "Hair Coloring", duration: "1 hr", price: 100 },
    { id: 3, name: "Hair Styling", duration: "1 hr", price: 100 },
    { id: 4, name: "Facial", duration: "1 hr", price: 100 },
    { id: 5, name: "Manicure", duration: "1 hr", price: 100 },
    { id: 6, name: "Pedicure", duration: "1 hr", price: 100 },
    { id: 7, name: "Waxing", duration: "1 hr", price: 100 },
    { id: 8, name: "Threading", duration: "1 hr", price: 100 }
  ],
  packages: [
    { 
      id: 1, 
      name: "Bridal Package", 
      duration: "4 hrs", 
      price: 500,
      description: "Complete bridal look including hair, makeup, and nail services"
    },
    { 
      id: 2, 
      name: "Spa Day Package", 
      duration: "3 hrs", 
      price: 300,
      description: "Relaxing spa day with facial, massage, and hair treatment"
    },
    { 
      id: 3, 
      name: "Hair Transformation", 
      duration: "2 hrs", 
      price: 200,
      description: "Hair cut, color, and styling for a complete new look"
    }
  ]
};

// Mock service to get salon by ID
export const getMockSalonById = (id) => {
  return Promise.resolve(mockSalon);
};