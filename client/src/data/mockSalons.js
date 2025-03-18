// Mock data for salons with 100+ entries
// Utility functions to generate consistent data
const generateSalon = (id, name, image, rating, reviews, distance, description, services, packages, galleryCount = 4, reviewCount = 3) => {
  // Generate gallery images from a pool of salon images
  const galleryPool = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&q=80",
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&q=80",
    "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=500&q=80",
    "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&q=80",
    "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=500&q=80"
  ];

  // Expanded pool of user profile images (41 URLs)
  const userImagePool = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
    "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    "https://images.unsplash.com/photo-1557555187-23d685287bc3?w=100&q=80",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&q=80",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80",
    "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=100&q=80",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80",
    "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&q=80",
    "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=100&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
    "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=100&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
    "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=100&q=80",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=100&q=80"
  ];
  
  // Generate random gallery images
  const gallery = [];
  const usedGalleryIndices = new Set();
  
  for (let i = 0; i < galleryCount; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * galleryPool.length);
    } while (usedGalleryIndices.has(randomIndex));
    
    usedGalleryIndices.add(randomIndex);
    gallery.push(galleryPool[randomIndex]);
  }
  
  // Generate random customer reviews
  const reviewComments = [
    "Absolutely loved my experience here! The staff was so professional.",
    "Great service and attention to detail. Will definitely come back!",
    "My new hairstyle is perfect. Exactly what I wanted!",
    "The best salon experience I've had in years. Highly recommend!",
    "Amazing results! Everyone keeps complimenting my new look.",
    "Very skilled stylists who really listen to what you want.",
    "Excellent service from start to finish. Love this place!",
    "The package deal was worth every penny. So happy with the results!",
    "Friendly staff and relaxing atmosphere. A real treat!",
    "Top-notch service and expertise. My go-to salon from now on!",
    "Incredible attention to detail. They really know what they're doing.",
    "The salon has such a welcoming vibe. I felt comfortable right away.",
    "My stylist was amazing and really understood what I wanted.",
    "Reasonable prices for the quality of service you receive.",
    "The staff went above and beyond to make sure I was happy.",
    "I've never had a better color treatment. Absolutely perfect!",
    "The massage chairs during the shampoo were heavenly!",
    "I appreciate how they explained each step of the process.",
    "They were able to fit me in last minute. Such great customer service!",
    "The products they use are high quality and smell amazing."
  ];
  
  const reviewNames = [
    "Emma S.", "James T.", "Sophia R.", "Noah P.", "Olivia M.", 
    "William K.", "Ava J.", "Benjamin H.", "Isabella G.", "Lucas F.",
    "Mia E.", "Henry D.", "Charlotte C.", "Alexander B.", "Amelia A.",
    "Daniel Z.", "Harper Y.", "Matthew X.", "Evelyn W.", "Michael V.",
    "Abigail U.", "Ethan T.", "Elizabeth S.", "Jacob R.", "Sofia Q.",
    "Logan P.", "Victoria O.", "Jackson N.", "Scarlett M.", "Aiden L.",
    "Grace K.", "Caden J.", "Lily I.", "Owen H.", "Hannah G.",
    "Gabriel F.", "Zoe E.", "Carter D.", "Penelope C.", "Wyatt B."
  ];
  
  const customerReviews = [];
  const usedCommentIndices = new Set();
  const usedNameIndices = new Set();
  const usedImageIndices = new Set();
  
  for (let i = 0; i < reviewCount; i++) {
    // 70% chance of 5-star, 25% chance of 4-star, 5% chance of 3-star
    let randomRating;
    const ratingRandom = Math.random();
    if (ratingRandom < 0.7) {
      randomRating = 5;
    } else if (ratingRandom < 0.95) {
      randomRating = 4;
    } else {
      randomRating = 3;
    }
    
    // Select unique comment, name, and image
    let randomCommentIndex, randomNameIndex, randomImageIndex;
    
    do {
      randomCommentIndex = Math.floor(Math.random() * reviewComments.length);
    } while (usedCommentIndices.has(randomCommentIndex) && usedCommentIndices.size < reviewComments.length);
    
    do {
      randomNameIndex = Math.floor(Math.random() * reviewNames.length);
    } while (usedNameIndices.has(randomNameIndex) && usedNameIndices.size < reviewNames.length);
    
    do {
      randomImageIndex = Math.floor(Math.random() * userImagePool.length);
    } while (usedImageIndices.has(randomImageIndex) && usedImageIndices.size < userImagePool.length);
    
    usedCommentIndices.add(randomCommentIndex);
    usedNameIndices.add(randomNameIndex);
    usedImageIndices.add(randomImageIndex);
    
    // Generate a random date within the last 60 days
    const today = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 60) + 1;
    const reviewDate = new Date(today);
    reviewDate.setDate(today.getDate() - randomDaysAgo);
    
    customerReviews.push({
      id: i + 1,
      userName: reviewNames[randomNameIndex],
      rating: randomRating,
      comment: reviewComments[randomCommentIndex],
      date: reviewDate.toISOString().split('T')[0],
      userImage: userImagePool[randomImageIndex]
    });
  }
  
  return {
    id,
    name,
    image,
    rating,
    reviews,
    distance,
    description,
    services,
    packages,
    gallery,
    customerReviews,
    // Add opening hours and location data
    openingHours: generateOpeningHours(),
    location: generateLocation()
  };
};

// Generate random opening hours
const generateOpeningHours = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = {};
  
  // Different opening patterns
  const patterns = [
    // Standard weekday + weekend pattern
    {
      weekday: { open: "9:00 AM", close: "7:00 PM" },
      saturday: { open: "10:00 AM", close: "6:00 PM" },
      sunday: { open: "11:00 AM", close: "5:00 PM" }
    },
    // Early opening pattern
    {
      weekday: { open: "8:00 AM", close: "8:00 PM" },
      saturday: { open: "9:00 AM", close: "7:00 PM" },
      sunday: { open: "10:00 AM", close: "4:00 PM" }
    },
    // Late closing pattern
    {
      weekday: { open: "10:00 AM", close: "9:00 PM" },
      saturday: { open: "10:00 AM", close: "8:00 PM" },
      sunday: { open: "11:00 AM", close: "6:00 PM" }
    },
    // Closed Sunday pattern
    {
      weekday: { open: "9:00 AM", close: "8:00 PM" },
      saturday: { open: "9:00 AM", close: "7:00 PM" },
      sunday: { open: "Closed", close: "Closed" }
    }
  ];
  
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  days.forEach(day => {
    if (day === "Sunday") {
      hours[day] = selectedPattern.sunday;
    } else if (day === "Saturday") {
      hours[day] = selectedPattern.saturday;
    } else {
      hours[day] = selectedPattern.weekday;
    }
  });
  
  return hours;
};

// Generate random location data
const generateLocation = () => {
  // Generate addresses in different cities
  const cities = [
    { city: "New York", state: "NY", zip: "10001", lat: 40.7128, lng: -74.0060 },
    { city: "Los Angeles", state: "CA", zip: "90001", lat: 34.0522, lng: -118.2437 },
    { city: "Chicago", state: "IL", zip: "60601", lat: 41.8781, lng: -87.6298 },
    { city: "Houston", state: "TX", zip: "77001", lat: 29.7604, lng: -95.3698 },
    { city: "Phoenix", state: "AZ", zip: "85001", lat: 33.4484, lng: -112.0740 },
    { city: "Philadelphia", state: "PA", zip: "19101", lat: 39.9526, lng: -75.1652 },
    { city: "San Antonio", state: "TX", zip: "78201", lat: 29.4241, lng: -98.4936 },
    { city: "San Diego", state: "CA", zip: "92101", lat: 32.7157, lng: -117.1611 },
    { city: "Dallas", state: "TX", zip: "75201", lat: 32.7767, lng: -96.7970 },
    { city: "San Jose", state: "CA", zip: "95101", lat: 37.3382, lng: -121.8863 }
  ];
  
  const streets = [
    "Main Street", "Oak Avenue", "Maple Drive", "Cedar Lane", "Pine Street",
    "Elm Road", "Washington Avenue", "Park Boulevard", "Highland Drive", "Sunset Boulevard",
    "Broadway", "Willow Lane", "Lake Street", "River Road", "Forest Avenue",
    "Mountain View Drive", "Valley Road", "Meadow Lane", "Ocean Drive", "Beach Road"
  ];
  
  const selectedCity = cities[Math.floor(Math.random() * cities.length)];
  const selectedStreet = streets[Math.floor(Math.random() * streets.length)];
  const buildingNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  
  // Add small random variation to lat/lng to avoid all salons in same spot
  const latVariation = (Math.random() - 0.5) * 0.05;
  const lngVariation = (Math.random() - 0.5) * 0.05;
  
  return {
    address: `${buildingNumber} ${selectedStreet}`,
    city: selectedCity.city,
    state: selectedCity.state,
    zip: selectedCity.zip,
    coordinates: {
      lat: selectedCity.lat + latVariation,
      lng: selectedCity.lng + lngVariation
    }
  };
};

const mockSalons = [];

// Common service templates that can be used for generating salons
const serviceTemplates = [
  // Hair services
  { name: "Basic Haircut", price: 35, duration: "30 min", description: "Simple haircut and style" },
  { name: "Premium Haircut", price: 55, duration: "45 min", description: "Detailed haircut with styling" },
  { name: "Men's Cut", price: 30, duration: "30 min", description: "Men's haircut and styling" },
  { name: "Women's Cut & Style", price: 50, duration: "45 min", description: "Women's haircut with blowout" },
  { name: "Kids Cut", price: 25, duration: "20 min", description: "Children's haircut (12 and under)" },
  { name: "Blowout", price: 40, duration: "30 min", description: "Wash and blowdry styling" },
  { name: "Root Touch-up", price: 65, duration: "1.5 hrs", description: "Color application for roots" },
  { name: "Full Color", price: 90, duration: "2 hrs", description: "All-over hair color application" },
  { name: "Partial Highlights", price: 85, duration: "1.5 hrs", description: "Highlights for top and sides" },
  { name: "Full Highlights", price: 120, duration: "2.5 hrs", description: "Complete highlight service" },
  { name: "Balayage", price: 140, duration: "2.5 hrs", description: "Hand-painted highlighting technique" },
  { name: "Ombre", price: 130, duration: "2.5 hrs", description: "Graduated color effect" },
  { name: "Deep Conditioning", price: 30, duration: "30 min", description: "Intensive hair treatment" },
  { name: "Keratin Treatment", price: 180, duration: "2.5 hrs", description: "Smoothing keratin service" },
  { name: "Brazilian Blowout", price: 200, duration: "2 hrs", description: "Smoothing and anti-frizz treatment" },
  { name: "Hair Extensions", price: 250, duration: "3 hrs", description: "Hair extension application" },
  { name: "Updo Styling", price: 75, duration: "1 hr", description: "Formal updo for special occasions" },
  { name: "Bridal Hair", price: 120, duration: "1.5 hrs", description: "Wedding day hair styling" },
  
  // Nail services
  { name: "Basic Manicure", price: 25, duration: "30 min", description: "Nail shaping, cuticle care, and polish" },
  { name: "Gel Manicure", price: 40, duration: "45 min", description: "Long-lasting gel polish application" },
  { name: "Pedicure", price: 45, duration: "45 min", description: "Foot care and polish application" },
  { name: "Deluxe Pedicure", price: 60, duration: "1 hr", description: "Luxury foot treatment with massage" },
  { name: "Nail Art", price: 15, duration: "15 min", description: "Custom nail designs" },
  { name: "Acrylic Nails", price: 70, duration: "1.5 hrs", description: "Full set of acrylic nails" },
  
  // Facial and skin services
  { name: "Express Facial", price: 50, duration: "30 min", description: "Quick refreshing facial" },
  { name: "Deep Cleansing Facial", price: 80, duration: "1 hr", description: "Thorough facial with extractions" },
  { name: "Anti-Aging Facial", price: 95, duration: "1 hr", description: "Rejuvenating facial for mature skin" },
  { name: "Microdermabrasion", price: 110, duration: "45 min", description: "Exfoliating skin treatment" },
  { name: "Chemical Peel", price: 120, duration: "45 min", description: "Skin resurfacing treatment" },
  
  // Waxing and threading
  { name: "Eyebrow Waxing", price: 15, duration: "15 min", description: "Eyebrow shaping with wax" },
  { name: "Lip Waxing", price: 10, duration: "10 min", description: "Upper lip hair removal" },
  { name: "Full Face Waxing", price: 45, duration: "30 min", description: "Complete facial hair removal" },
  { name: "Eyebrow Threading", price: 15, duration: "15 min", description: "Precise eyebrow shaping" },
  
  // Massage and body treatments
  { name: "Swedish Massage", price: 80, duration: "1 hr", description: "Relaxing full body massage" },
  { name: "Deep Tissue Massage", price: 95, duration: "1 hr", description: "Therapeutic muscle massage" },
  { name: "Hot Stone Massage", price: 110, duration: "1.25 hrs", description: "Massage with heated stones" },
  { name: "Body Scrub", price: 70, duration: "45 min", description: "Exfoliating body treatment" },
  { name: "Body Wrap", price: 85, duration: "1 hr", description: "Detoxifying body treatment" }
];

// Common package templates
const packageTemplates = [
  {
    name: "Complete Makeover",
    services: ["Premium Haircut", "Full Color", "Manicure"],
    price: 150,
    duration: "3.5 hrs",
    description: "Full beauty transformation package"
  },
  {
    name: "Relaxation Package",
    services: ["Swedish Massage", "Express Facial", "Pedicure"],
    price: 160,
    duration: "2.5 hrs",
    description: "Ultimate relaxation experience"
  },
  {
    name: "Bridal Package",
    services: ["Bridal Hair", "Makeup Application", "Gel Manicure"],
    price: 200,
    duration: "3 hrs",
    description: "Complete bridal beauty preparation"
  },
  {
    name: "Men's Grooming",
    services: ["Men's Cut", "Beard Trim", "Facial"],
    price: 100,
    duration: "1.5 hrs",
    description: "Complete men's grooming experience"
  },
  {
    name: "Color Transformation",
    services: ["Full Color", "Deep Conditioning", "Blowout"],
    price: 140,
    duration: "3 hrs",
    description: "Complete hair color makeover"
  },
  {
    name: "Spa Day",
    services: ["Deep Tissue Massage", "Deep Cleansing Facial", "Deluxe Pedicure"],
    price: 210,
    duration: "3 hrs",
    description: "Full day of pampering and relaxation"
  },
  {
    name: "Quick Refresh",
    services: ["Basic Haircut", "Express Facial"],
    price: 75,
    duration: "1 hr",
    description: "Quick beauty refresh when you're short on time"
  },
  {
    name: "Hair Repair",
    services: ["Keratin Treatment", "Deep Conditioning", "Trim"],
    price: 220,
    duration: "3.5 hrs",
    description: "Restorative treatment for damaged hair"
  },
  {
    name: "Luxury Experience",
    services: ["Balayage", "Hot Stone Massage", "Gel Manicure", "Pedicure"],
    price: 280,
    duration: "5 hrs",
    description: "Premium head-to-toe beauty experience"
  },
  {
    name: "Couples Retreat",
    services: ["Swedish Massage (2)", "Pedicure (2)"],
    price: 240,
    duration: "2 hrs",
    description: "Relaxing spa experience for two"
  }
];

// Generate salon descriptions
const salonDescriptions = [
  "Upscale salon offering premium hair and beauty services in a luxurious setting.",
  "Contemporary salon with expert stylists specializing in modern cuts and colors.",
  "Family-friendly salon providing quality services for all ages at affordable prices.",
  "Trendy salon specializing in cutting-edge styles and innovative color techniques.",
  "Full-service beauty lounge offering hair, nail, and skin treatments in a relaxing environment.",
  "Boutique salon focused on personalized service and attention to detail.",
  "Modern salon with a team of creative stylists who stay current with the latest trends.",
  "Eco-friendly salon using organic and sustainable products for all services.",
  "High-end salon offering premium services with exceptional attention to detail.",
  "Award-winning salon known for excellence in all aspects of hair and beauty services.",
  "Urban-inspired salon specializing in contemporary styles for the city dweller.",
  "Wellness-focused salon combining beauty services with holistic health approaches.",
  "Inclusive salon specializing in services for all hair types and textures.",
  "Luxury salon providing VIP treatment and complimentary refreshments with every service.",
  "Innovative salon featuring the latest technology and techniques in hair and beauty.",
  "Artistic salon where stylists approach hair as a creative canvas.",
  "Specialized salon focusing on color corrections and transformations.",
  "Relaxing spa-like salon offering a peaceful escape from the busy world.",
  "Budget-friendly salon providing quality services at accessible prices.",
  "Celebrity-inspired salon bringing red carpet looks to everyday clients.",
  "Chic salon with Instagram-worthy decor and top-tier stylists.",
  "Vintage-themed salon combining classic techniques with modern trends.",
  "Health-conscious salon using only non-toxic and cruelty-free products.",
  "Minimalist salon focused on precision cuts and natural beauty.",
  "Vibrant salon known for bold colors and avant-garde styling."
];

// Generate unique salon names
const salonNames = [
  "Elegance Hair Studio", "Chic Cuts", "The Hair Loft", "Trendy Trims", "Glamour Salon",
  "Scissors & Style", "Mane Attraction", "Hair Haven", "Curl Up & Dye", "Shear Perfection",
  "Cutting Edge", "Locks & Looks", "Hair Affair", "Strands & Style", "Clip Joint",
  "Snip & Style", "Mane Event", "Tress Chic", "Fringe Benefits", "Shear Delight",
  "Clip Art", "Hairology", "Salon Bliss", "Mane Street", "Hairspray",
  "Roots Salon", "Scissors Palace", "Brush & Blow", "Salon Serenity", "Classy Cuts",
  "Tress for Success", "Mane Concern", "Shear Magic", "Cutting Room", "Hair Studio",
  "Salon Allure", "Style Savvy", "Clip & Curl", "Shear Elegance", "Tress Trends",
  "Salon Couture", "Mane Focus", "Shear Artistry", "Cutting Crew", "Hair Lounge",
  "Salon Glam", "Style Masters", "Shear Brilliance", "Cutting Class", "Hair Envy",
  "Salon Luxe", "Beauty Bar", "Shear Genius", "Style Central", "Hair Flair",
  "Salon Chic", "Gloss & Glamour", "Shear Excellence", "Style Spot", "Hair Dazzle",
  "Salon Elite", "Beauty Boutique", "Polished Look", "Style Zone", "Hair Sensation",
  "Salon Prestige", "Beauty Lounge", "Refined Edge", "Style Point", "Hair Distinction",
  "Salon Opulence", "Beauty Haven", "Sleek Style", "Trend Setters", "Hair Radiance",
  "Salon Grandeur", "Beauty Retreat", "Sophisticated Cuts", "Urban Style", "Hair Splendor",
  "Salon Majesty", "Beauty Oasis", "Signature Cuts", "Metro Style", "Hair Magnificence",
  "The Style Studio", "Glow Up", "Precision Cuts", "Vogue Hair", "Lush Locks",
  "The Beauty Collective", "Glam Room", "Artisan Hair", "Runway Style", "Luxe Locks",
  "The Styling Co.", "Glow Getters", "Craft Cuts", "Haute Hair", "Lavish Locks"
];

// Generate additional salons
for (let i = 1; i <= 100; i++) {
  // Select a unique salon name
  const nameIndex = Math.floor(Math.random() * salonNames.length);
  const name = salonNames[nameIndex];
  salonNames.splice(nameIndex, 1); // Remove used name
  
  // Select a random image for the main salon image
  const galleryPool = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&q=80",
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&q=80",
    "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=500&q=80",
    "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    // Additional salon images
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&q=80",
    "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=500&q=80"
  ];

  const imageIndex = Math.floor(Math.random() * galleryPool.length);
  const image = galleryPool[imageIndex];
  
  // Generate random rating (4.0-5.0)
  const rating = (4 + Math.random()).toFixed(1);
  
  // Generate random number of reviews (100-2500)
  const reviews = Math.floor(Math.random() * 2400) + 100;
  
  // Generate random distance (0.5-10.0 miles)
  const distance = (Math.random() * 9.5 + 0.5).toFixed(1);
  
  // Select a random description
  const descIndex = Math.floor(Math.random() * salonDescriptions.length);
  const description = salonDescriptions[descIndex];
  
  // Generate 3-7 random services
  const serviceCount = Math.floor(Math.random() * 5) + 3;
  const services = [];
  const usedServiceIndices = new Set();
  
  for (let j = 0; j < serviceCount; j++) {
    let serviceIndex;
    do {
      serviceIndex = Math.floor(Math.random() * serviceTemplates.length);
    } while (usedServiceIndices.has(serviceIndex));
    
    usedServiceIndices.add(serviceIndex);
    
    // Add small price variation (±10%) to make each salon unique
    const basePrice = serviceTemplates[serviceIndex].price;
    const priceVariation = Math.random() * 0.2 - 0.1; // -10% to +10%
    const adjustedPrice = Math.round(basePrice * (1 + priceVariation));
    
    services.push({
      id: j + 1,
      name: serviceTemplates[serviceIndex].name,
      price: adjustedPrice,
      duration: serviceTemplates[serviceIndex].duration,
      description: serviceTemplates[serviceIndex].description
    });
  }
  
  // Generate 1-3 random packages
  const packageCount = Math.floor(Math.random() * 3) + 1;
  const packages = [];
  const usedPackageIndices = new Set();
  
  for (let j = 0; j < packageCount; j++) {
    let packageIndex;
    do {
      packageIndex = Math.floor(Math.random() * packageTemplates.length);
    } while (usedPackageIndices.has(packageIndex));
    
    usedPackageIndices.add(packageIndex);
    
    // Add small price variation (±5%) to make each salon unique
    const basePrice = packageTemplates[packageIndex].price;
    const priceVariation = Math.random() * 0.1 - 0.05; // -5% to +5%
    const adjustedPrice = Math.round(basePrice * (1 + priceVariation));
    
    packages.push({
      id: j + 1,
      name: packageTemplates[packageIndex].name,
      services: packageTemplates[packageIndex].services,
      price: adjustedPrice,
      duration: packageTemplates[packageIndex].duration,
      description: packageTemplates[packageIndex].description
    });
  }
  
  // Generate random gallery count (2-5)
  const galleryCount = Math.floor(Math.random() * 4) + 2;
  
  // Generate random review count (1-4)
  const reviewCount = Math.floor(Math.random() * 4) + 1;
  
  // Create the salon using the generateSalon function
  const salon = generateSalon(
    i,
    name,
    image,
    rating,
    reviews,
    distance,
    description,
    services,
    packages,
    galleryCount,
    reviewCount
  );
  
  // Add the salon to the mockSalons array
  mockSalons.push(salon);
}

// Add a few featured salons with higher ratings and more reviews
for (let i = 0; i < 5; i++) {
  if (mockSalons[i]) {
    mockSalons[i].rating = (4.8 + Math.random() * 0.2).toFixed(1); // 4.8-5.0
    mockSalons[i].reviews = Math.floor(Math.random() * 1000) + 2500; // 2500-3500
    mockSalons[i].featured = true;
    mockSalons[i].featuredReason = [
      "Top Rated in Your Area",
      "Most Popular Choice",
      "Editor's Pick",
      "Best Value",
      "Highly Recommended"
    ][i];
  }
}

// Add a few salons with special offers
for (let i = 5; i < 15; i++) {
  if (mockSalons[i]) {
    mockSalons[i].specialOffer = {
      discount: Math.floor(Math.random() * 16) + 15 + "%", // 15-30% discount
      description: [
        "New Client Special",
        "Limited Time Offer",
        "Holiday Promotion",
        "Seasonal Special",
        "Weekday Discount",
        "First-Time Customer Deal",
        "Referral Bonus",
        "Monthly Special",
        "Flash Sale",
        "Member Discount"
      ][i - 5]
    };
  }
}

// Add a few salons with availability information
for (let i = 0; i < mockSalons.length; i++) {
  // 80% of salons have availability info
  if (Math.random() < 0.8) {
    const availableSlots = [];
    const today = new Date();
    
    // Generate 0-5 available slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      
      const slotCount = Math.floor(Math.random() * 6); // 0-5 slots
      
      for (let slot = 0; slot < slotCount; slot++) {
        // Generate random hour between 9 AM and 6 PM
        const hour = Math.floor(Math.random() * 10) + 9;
        // Generate random minute (0, 15, 30, 45)
        const minute = Math.floor(Math.random() * 4) * 15;
        
        availableSlots.push({
          date: date.toISOString().split('T')[0],
          time: `${hour}:${minute.toString().padStart(2, '0')}`,
          formattedTime: `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
        });
      }
    }
    
    mockSalons[i].availability = availableSlots;
  }
}

export default mockSalons;