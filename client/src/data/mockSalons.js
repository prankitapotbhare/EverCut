// Mock data for salons with 100+ entries
const mockSalons = [
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
    distance: 2.1,
    description: "Contemporary salon with expert stylists specializing in modern cuts and colors.",
    services: [
      { id: 1, name: "Men's Haircut", price: 35, duration: "30 min", description: "Classic men's haircut and styling" },
      { id: 2, name: "Women's Haircut", price: 55, duration: "45 min", description: "Women's haircut and blowout" },
      { id: 3, name: "Balayage", price: 120, duration: "2.5 hrs", description: "Hand-painted highlights" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80"
    ]
  },
  {
    id: 3,
    name: "Glamour Cuts",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.8,
    reviews: 1100,
    distance: 1.8,
    description: "Upscale salon offering premium hair services and beauty treatments.",
    services: [
      { id: 1, name: "Precision Cut", price: 60, duration: "45 min", description: "Detailed haircut with styling" },
      { id: 2, name: "Full Highlights", price: 110, duration: "2 hrs", description: "Complete hair highlighting" }
    ]
  },
  {
    id: 4,
    name: "Elite Hair Studio",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
    rating: 4.6,
    reviews: 750,
    distance: 4.2,
    description: "Luxury hair studio with personalized services and expert stylists."
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
  },
  {
    id: 13,
    name: "Salon Excellence",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    rating: 4.9,
    reviews: 2200,
    distance: 3.3
  },
  {
    id: 14,
    name: "The Hair Gallery",
    image: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    rating: 4.5,
    reviews: 850,
    distance: 2.7
  },
  {
    id: 15,
    name: "Trendy Trims",
    image: "https://images.unsplash.com/photo-1598887142487-3c854d51d185?w=500&q=80",
    rating: 4.6,
    reviews: 730,
    distance: 4.1
  },
  {
    id: 16,
    name: "Style Hub",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.8,
    reviews: 1600,
    distance: 3.8
  },
  {
    id: 17,
    name: "Classic Cuts",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    rating: 4.7,
    reviews: 950,
    distance: 2.3
  },
  {
    id: 18,
    name: "Luxe Beauty",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
    rating: 4.9,
    reviews: 1900,
    distance: 3.6
  },
  {
    id: 19,
    name: "Elegant Styles",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80",
    rating: 4.8,
    reviews: 1450,
    distance: 2.2
  },
  {
    id: 20,
    name: "Prestige Hair",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&q=80",
    rating: 4.7,
    reviews: 1020,
    distance: 3.9
  },
  {
    id: 21,
    name: "Mane Attraction",
    image: "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=500&q=80",
    rating: 4.6,
    reviews: 890,
    distance: 4.3
  },
  {
    id: 22,
    name: "Curl Up & Dye",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&q=80",
    rating: 4.8,
    reviews: 1320,
    distance: 2.5
  },
  {
    id: 23,
    name: "Shear Elegance",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    rating: 4.9,
    reviews: 2050,
    distance: 1.7
  },
  {
    id: 24,
    name: "Cutting Edge",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.7,
    reviews: 1180,
    distance: 3.2
  },
  {
    id: 25,
    name: "Hair Dimension",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    rating: 4.5,
    reviews: 780,
    distance: 4.7
  },
  {
    id: 26,
    name: "Tress for Success",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    rating: 4.8,
    reviews: 1560,
    distance: 2.8
  },
  {
    id: 27,
    name: "Clipper's Corner",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    rating: 4.6,
    reviews: 920,
    distance: 3.5
  },
  {
    id: 28,
    name: "Strand Studio",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    rating: 4.9,
    reviews: 1870,
    distance: 2.1
  },
  {
    id: 29,
    name: "Follicle Fantasy",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    rating: 4.7,
    reviews: 1050,
    distance: 3.8
  },
  {
    id: 30,
    name: "Snip & Style",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.8,
    reviews: 1430,
    distance: 2.6
  },
  {
    id: 31,
    name: "Roots Hair Salon",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    rating: 4.6,
    reviews: 870,
    distance: 4.1
  },
  {
    id: 32,
    name: "Fringe Benefits",
    image: "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    rating: 4.9,
    reviews: 2150,
    distance: 1.9
  },
  {
    id: 33,
    name: "Mane Street",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    rating: 4.7,
    reviews: 1240,
    distance: 3.3
  },
  {
    id: 34,
    name: "Locks & Loaded",
    image: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    rating: 4.5,
    reviews: 760,
    distance: 4.5
  },
  {
    id: 35,
    name: "Hair Apparent",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    rating: 4.8,
    reviews: 1380,
    distance: 2.4
  },
  {
    id: 36,
    name: "Shear Delight",
    image: "https://images.unsplash.com/photo-1598887142487-3c854d51d185?w=500&q=80",
    rating: 4.7,
    reviews: 1120,
    distance: 3.1
  },
  {
    id: 37,
    name: "Clip Joint",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    rating: 4.6,
    reviews: 940,
    distance: 3.7
  },
  {
    id: 38,
    name: "Hairitage",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.9,
    reviews: 1980,
    distance: 2.2
  },
  {
    id: 39,
    name: "Mane Event",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    rating: 4.7,
    reviews: 1260,
    distance: 3.4
  },
  {
    id: 40,
    name: "Hairology",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    rating: 4.8,
    reviews: 1490,
    distance: 2.7
  },
  {
    id: 41,
    name: "Scissor Sisters",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    rating: 4.6,
    reviews: 910,
    distance: 4.2
  },
  {
    id: 42,
    name: "Tress Chic",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    rating: 4.9,
    reviews: 2080,
    distance: 1.8
  },
  {
    id: 43,
    name: "Hairdo Hideaway",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    rating: 4.7,
    reviews: 1150,
    distance: 3.6
  },
  {
    id: 44,
    name: "Strand by Strand",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.5,
    reviews: 830,
    distance: 4.3
  },
  {
    id: 45,
    name: "Curl Up & Dye",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    rating: 4.8,
    reviews: 1540,
    distance: 2.5
  },
  {
    id: 46,
    name: "Shear Perfection",
    image: "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    rating: 4.6,
    reviews: 970,
    distance: 3.9
  },
  {
    id: 47,
    name: "Cutting Room",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    rating: 4.9,
    reviews: 2120,
    distance: 2.1
  },
  {
    id: 48,
    name: "Mane Attraction",
    image: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    rating: 4.7,
    reviews: 1280,
    distance: 3.2
  },
  {
    id: 49,
    name: "Hair We Are",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    rating: 4.5,
    reviews: 790,
    distance: 4.6
  },
  {
    id: 50,
    name: "Cliptomania",
    image: "https://images.unsplash.com/photo-1598887142487-3c854d51d185?w=500&q=80",
    rating: 4.8,
    reviews: 1470,
    distance: 2.8
  },
  {
    id: 51,
    name: "Hairway to Heaven",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    rating: 4.6,
    reviews: 930,
    distance: 3.5
  },
  {
    id: 52,
    name: "Fringe Benefits",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.9,
    reviews: 2030,
    distance: 1.9
  },
  {
    id: 53,
    name: "Shear Magic",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    rating: 4.7,
    reviews: 1210,
    distance: 3.3
  },
  {
    id: 54,
    name: "Clip Art",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    rating: 4.5,
    reviews: 850,
    distance: 4.4
  },
  {
    id: 55,
    name: "Hairline",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    rating: 4.8,
    reviews: 1520,
    distance: 2.6
  },
  {
    id: 56,
    name: "Mane Street",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    rating: 4.6,
    reviews: 960,
    distance: 3.8
  },
  {
    id: 57,
    name: "Tress for Success",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    rating: 4.9,
    reviews: 2170,
    distance: 2.0
  },
  {
    id: 58,
    name: "Hairdo or Dye",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.7,
    reviews: 1230,
    distance: 3.4
  },
  {
    id: 59,
    name: "Shear Genius",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    rating: 4.5,
    reviews: 810,
    distance: 4.5
  },
  {
    id: 60,
    name: "Cutting Edge",
    image: "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    rating: 4.8,
    reviews: 1580,
    distance: 2.3
  },
  {
    id: 61,
    name: "Hair Apparent",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    rating: 4.6,
    reviews: 990,
    distance: 3.7
  },
  {
    id: 62,
    name: "Mane Attraction",
    image: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    rating: 4.9,
    reviews: 2090,
    distance: 1.7
  },
  {
    id: 63,
    name: "Clip Joint",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    rating: 4.7,
    reviews: 1270,
    distance: 3.1
  },
  {
    id: 64,
    name: "Hairology",
    image: "https://images.unsplash.com/photo-1598887142487-3c854d51d185?w=500&q=80",
    rating: 4.5,
    reviews: 770,
    distance: 4.7
  },
  {
    id: 65,
    name: "Shear Delight",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    rating: 4.8,
    reviews: 1510,
    distance: 2.5
  },
  {
    id: 66,
    name: "Tress Chic",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.6,
    reviews: 950,
    distance: 3.9
  },
  {
    id: 67,
    name: "Hairitage",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    rating: 4.9,
    reviews: 2140,
    distance: 2.2
  },
  {
    id: 68,
    name: "Mane Event",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    rating: 4.7,
    reviews: 1190,
    distance: 3.5
  },
  {
    id: 69,
    name: "Scissor Sisters",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    rating: 4.5,
    reviews: 840,
    distance: 4.3
  },
  {
    id: 70,
    name: "Hairdo Hideaway",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    rating: 4.8,
    reviews: 1550,
    distance: 2.7
  },
  {
    id: 71,
    name: "Strand by Strand",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    rating: 4.6,
    reviews: 980,
    distance: 3.6
  },
  {
    id: 72,
    name: "Curl Up & Dye",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.9,
    reviews: 2060,
    distance: 1.8
  },
  {
    id: 73,
    name: "Shear Perfection",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    rating: 4.7,
    reviews: 1250,
    distance: 3.2
  },
  {
    id: 74,
    name: "Cutting Room",
    image: "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    rating: 4.5,
    reviews: 800,
    distance: 4.6
  },
  {
    id: 75,
    name: "Hair We Are",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    rating: 4.8,
    reviews: 1530,
    distance: 2.4
  },
  {
    id: 76,
    name: "Cliptomania",
    image: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    rating: 4.6,
    reviews: 940,
    distance: 3.8
  },
  {
    id: 77,
    name: "Hairway to Heaven",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    rating: 4.9,
    reviews: 2110,
    distance: 2.1
  },
  {
    id: 78,
    name: "Fringe Benefits",
    image: "https://images.unsplash.com/photo-1598887142487-3c854d51d185?w=500&q=80",
    rating: 4.7,
    reviews: 1220,
    distance: 3.3
  },
  {
    id: 79,
    name: "Shear Magic",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    rating: 4.5,
    reviews: 780,
    distance: 4.5
  },
  {
    id: 80,
    name: "Clip Art",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.8,
    reviews: 1560,
    distance: 2.6
  },
  {
    id: 81,
    name: "Hairline",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    rating: 4.6,
    reviews: 970,
    distance: 3.7
  },
  {
    id: 82,
    name: "Mane Street",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    rating: 4.9,
    reviews: 2180,
    distance: 1.9
  },
  {
    id: 83,
    name: "Tress for Success",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    rating: 4.7,
    reviews: 1240,
    distance: 3.4
  },
  {
    id: 84,
    name: "Hairdo or Dye",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    rating: 4.5,
    reviews: 820,
    distance: 4.4
  },
  {
    id: 85,
    name: "Shear Genius",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    rating: 4.8,
    reviews: 1590,
    distance: 2.3
  },
  {
    id: 86,
    name: "Cutting Edge",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.6,
    reviews: 1000,
    distance: 3.6
  },
  {
    id: 87,
    name: "Hair Apparent",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
    rating: 4.9,
    reviews: 2070,
    distance: 2.0
  },
  {
    id: 88,
    name: "Mane Attraction",
    image: "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=500&q=80",
    rating: 4.7,
    reviews: 1260,
    distance: 3.2
  },
  {
    id: 89,
    name: "Clip Joint",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80",
    rating: 4.5,
    reviews: 790,
    distance: 4.7
  },
  {
    id: 90,
    name: "Hairology",
    image: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    rating: 4.8,
    reviews: 1540,
    distance: 2.5
  },
  {
    id: 91,
    name: "Shear Delight",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80",
    rating: 4.6,
    reviews: 960,
    distance: 3.8
  },
  {
    id: 92,
    name: "Tress Chic",
    image: "https://images.unsplash.com/photo-1598887142487-3c854d51d185?w=500&q=80",
    rating: 4.9,
    reviews: 2130,
    distance: 1.8
  },
  {
    id: 93,
    name: "Hairitage",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80",
    rating: 4.7,
    reviews: 1200,
    distance: 3.5
  },
  {
    id: 94,
    name: "Mane Event",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
    rating: 4.5,
    reviews: 830,
    distance: 4.3
  },
  {
    id: 95,
    name: "Scissor Sisters",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80",
    rating: 4.8,
    reviews: 1570,
    distance: 2.7
  },
  {
    id: 96,
    name: "Hairdo Hideaway",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    rating: 4.6,
    reviews: 990,
    distance: 3.6
  },
  {
    id: 97,
    name: "Strand by Strand",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=80",
    rating: 4.9,
    reviews: 2050,
    distance: 2.1
  },
  {
    id: 98,
    name: "Curl Up & Dye",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    rating: 4.7,
    reviews: 1230,
    distance: 3.3
  },
  {
    id: 99,
    name: "Shear Perfection",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
    rating: 4.5,
    reviews: 810,
    distance: 4.5
  },
  {
    id: 100,
    name: "Cutting Room",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=500&q=80",
    rating: 4.8,
    reviews: 1550,
    distance: 2.4
  },
];

export default mockSalons;