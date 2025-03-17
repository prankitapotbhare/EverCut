# Salon Booking System Tech Stack Documentation

## Technology Stack Overview

### Frontend
- **Framework**: React 18.2.0 with Vite 5.0.0
- **Styling**: Tailwind CSS 3.4.0
- **State Management**: React Query 5.0.0
- **Routing**: React Router DOM 6.20.0
- **Form Management**: React Hook Form 7.48.0
- **UI Components**: Headless UI 1.7.0

### Backend
- **Framework**: Express.js 4.18.2
- **Language**: Node.js 20.x with TypeScript 5.3.0
- **API Documentation**: Swagger/OpenAPI 3.0
- **Authentication Middleware**: express-jwt 8.4.1

### Database
- **Primary Database**: MongoDB 7.0
- **ODM**: Mongoose 8.0.0
- **User Profiles**: Firestore (existing implementation)

### Authentication & Authorization
- **Service**: Firebase Authentication (existing implementation)
- **Strategy**: JWT for API authentication
- **Security**: Helmet.js 7.1.0

### File Storage
- **Service**: Firebase Storage
- **SDK**: Firebase Admin SDK 12.0.0

### Search
- **Engine**: MongoDB Atlas Search
- **Alternative**: Algolia (if advanced search capabilities required)

### Maps Integration
- **API**: Google Maps JavaScript API
- **React Component**: @react-google-maps/api 2.19.2

### Payment Processing
- **Provider**: Stripe
- **SDK**: stripe-node 13.5.0
- **React Component**: @stripe/react-stripe-js 2.4.0

### Notifications
- **Email**: Nodemailer 6.9.7 with SendGrid transport
- **Real-time**: Socket.io 4.7.2

## Project Structure

```
salon-booking/
├── client/                      # Frontend React application
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── components/          # Reusable components
│   │   │   ├── common/          # Generic UI components
│   │   │   ├── layout/          # Layout components
│   │   │   └── salon/           # Salon-specific components
│   │   ├── context/             # React context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   ├── services/            # API client services
│   │   ├── styles/              # Global styles
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── App.tsx              # Main application component
│   │   ├── main.tsx             # Entry point
│   │   └── firebase.ts          # Firebase configuration
│   ├── index.html
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                      # Backend Express application
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Custom middleware
│   │   ├── models/              # Mongoose models
│   │   │   ├── Salon.ts
│   │   │   ├── Service.ts
│   │   │   ├── Booking.ts
│   │   │   └── Review.ts
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── types/               # TypeScript interface definitions
│   │   ├── utils/               # Utility functions
│   │   └── app.ts               # Express application setup
│   ├── .env.example             # Environment variables example
│   ├── tsconfig.json
│   └── package.json
│
├── docker/                      # Docker configuration
│   ├── Dockerfile.client
│   ├── Dockerfile.server
│   └── docker-compose.yml
│
├── .github/                     # GitHub Actions workflows
├── .gitignore
└── README.md
```

## Core Dependencies

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "firebase-admin": "^12.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "joi": "^17.11.0",
    "express-jwt": "^8.4.1",
    "stripe": "^13.5.0",
    "socket.io": "^4.7.2",
    "nodemailer": "^6.9.7",
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "@types/express": "^4.17.21",
    "@types/node": "^20.9.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.48.0",
    "@headlessui/react": "^1.7.0",
    "firebase": "^10.5.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "@stripe/stripe-js": "^2.2.0",
    "@react-google-maps/api": "^2.19.2",
    "date-fns": "^2.30.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "typescript": "^5.3.0"
  }
}
```

## Database Schema Design

### Salon
```typescript
// server/src/models/Salon.ts
import mongoose from 'mongoose';

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  images: [{ type: String }],  // Firebase Storage URLs
  operatingHours: [{
    day: { type: Number, required: true },  // 0-6 for Sunday-Saturday
    open: { type: String, required: true },  // "09:00"
    close: { type: String, required: true }  // "18:00"
  }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

salonSchema.index({ name: 'text', 'address.city': 'text' });

export default mongoose.model('Salon', salonSchema);
```

### Service
```typescript
// server/src/models/Service.ts
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },  // in minutes
  category: { type: String, required: true },
  image: { type: String },  // Firebase Storage URL
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

serviceSchema.index({ salonId: 1, name: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Service', serviceSchema);
```

### Booking
```typescript
// server/src/models/Booking.ts
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // Firebase UID
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  services: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }
  }],
  date: { type: Date, required: true },
  startTime: { type: String, required: true },  // "14:30"
  endTime: { type: String, required: true },    // "15:45"
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentIntentId: { type: String },  // Stripe payment intent ID
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.index({ userId: 1, date: -1 });
bookingSchema.index({ salonId: 1, date: 1 });

export default mongoose.model('Booking', bookingSchema);
```

### Review
```typescript
// server/src/models/Review.ts
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // Firebase UID
  userName: { type: String, required: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [{ type: String }],  // Firebase Storage URLs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reviewSchema.index({ salonId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

export default mongoose.model('Review', reviewSchema);
```

## Deployment Considerations

1. **Containerization**: Use Docker for both frontend and backend
2. **Database**: MongoDB Atlas (cloud-hosted solution)
3. **Authentication**: Firebase Authentication remains centralized
4. **Storage**: Firebase Storage for all file needs
5. **Hosting Options**:
   - Backend: DigitalOcean, AWS, or Google Cloud
   - Frontend: Vercel, Netlify, or Firebase Hosting
6. **CI/CD**: GitHub Actions for automated testing and deployment
7. **Monitoring**: MongoDB Atlas monitoring + custom application logging
8. **Scalability**: Horizontal scaling through container orchestration