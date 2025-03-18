// Mock data for salons
const salonData = [
  {
    id: 1,
    name: "Ravi Salon & Spa",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    rating: 4.9,
    reviews: 1300,
    distance: 3.4,
    description: "Premium salon offering a wide range of hair and beauty services in a luxurious setting.",
    services: [
      { id: 1, name: "Haircut & Style", price: 45, duration: "45 min", description: "Professional haircut and styling" },
      { id: 2, name: "Hair Color", price: 85, duration: "2 hrs", description: "Full hair coloring service" },
      { id: 3, name: "Manicure", price: 35, duration: "30 min", description: "Classic manicure treatment" },
      { id: 4, name: "Facial", price: 75, duration: "1 hr", description: "Deep cleansing facial" },
      { id: 5, name: "Massage", price: 90, duration: "1 hr", description: "Relaxing full body massage" }
    ],
    packages: [
      {
        id: 1,
        name: "Bridal Package",
        services: ["Haircut & Style", "Makeup", "Manicure", "Pedicure"],
        price: 199,
        duration: "4 hrs",
        description: "Complete bridal beauty package"
      },
      {
        id: 2,
        name: "Spa Day Package",
        services: ["Massage", "Facial", "Manicure"],
        price: 159,
        duration: "3 hrs",
        description: "Relaxing spa day experience"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
      "https://images.unsplash.com/photo-1522337094846-8a8162e0afc8?w=500&q=80",
      "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80"
    ],
    customerReviews: [
      {
        id: 1,
        userName: "Sarah M.",
        rating: 5,
        comment: "Amazing service! The staff was very professional and friendly.",
        date: "2024-03-15",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
      },
      {
        id: 2,
        userName: "John D.",
        rating: 4,
        comment: "Great haircut, will definitely come back!",
        date: "2024-03-10",
        userImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
      }
    ]
  },
  {
    id: 2,
    name: "Style Studio",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    rating: 4.7,
    reviews: 980,
    distance: 2.1
  },
  {
    id: 3,
    name: "Glamour Cuts",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.8,
    reviews: 1100,
    distance: 1.8
  },
  {
    id: 4,
    name: "Elite Hair Studio",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
    rating: 4.6,
    reviews: 750,
    distance: 4.2
  },
  {
    id: 5,
    name: "Beauty Lounge",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    rating: 4.9,
    reviews: 2100,
    distance: 2.8
  },
  {
    id: 6,
    name: "The Barber Shop",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    rating: 4.7,
    reviews: 890,
    distance: 1.5
  },
  {
    id: 7,
    name: "Scissors & Style",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    rating: 4.8,
    reviews: 1500,
    distance: 3.1
  },
  {
    id: 8,
    name: "Modern Cuts",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.5,
    reviews: 670,
    distance: 2.4
  },
  {
    id: 9,
    name: "Hair Masters",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    rating: 4.9,
    reviews: 1800,
    distance: 3.7
  },
  {
    id: 10,
    name: "Chic & Sharp",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.6,
    reviews: 920,
    distance: 4.5
  },
  {
    id: 11,
    name: "Urban Style",
    image: "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    rating: 4.8,
    reviews: 1250,
    distance: 2.9
  },
  {
    id: 12,
    name: "Premium Cuts",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    rating: 4.7,
    reviews: 1100,
    distance: 1.9
  }
];

// Simulate API calls
export const getSalons = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(salonData);
    }, 300); // Simulate network delay
  });
};

export const getSalonById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const salon = salonData.find(salon => salon.id === id);
      if (salon) {
        resolve(salon);
      } else {
        reject(new Error('Salon not found'));
      }
    }, 300);
  });
};