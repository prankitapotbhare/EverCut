# EverCut Technical Stack

## Frontend Stack

### Core Technologies
- **JavaScript Framework**: React 19
- **Build Tool**: Vite 6
- **CSS Framework**: Tailwind CSS 4
- **State Management**: React Context API
- **Routing**: React Router 7
- **Package Manager**: npm

### UI Components & Styling
- **Icons**: 
  - Font Awesome (`@fortawesome/fontawesome-svg-core`, `@fortawesome/free-brands-svg-icons`, `@fortawesome/react-fontawesome`)
  - React Icons
  - Lucide React
- **Animations**: Framer Motion
- **Responsive Design**: Tailwind CSS mobile-first approach

### Forms & Validation
- **Form Management**: React Hook Form
- **Validation**: Custom validation logic

### Authentication
- **Authentication Provider**: Firebase Authentication
- **Social Auth**: Google OAuth via Firebase
- **Email Verification**: Firebase Auth email verification
- **Password Management**: Firebase Auth password reset

### API & Data Management
- **API Client**: Custom service modules
- **Data Fetching**: Native fetch API with async/await
- **Data Caching**: In-memory caching via context state

### Payment Processing
- **Payment Gateway**: Stripe
- **Payment Components**: `@stripe/react-stripe-js`, `@stripe/stripe-js`

### Development Tools
- **Linting**: ESLint 9 with React plugins
- **Module Resolution**: Alias paths via Vite configuration
- **TypeScript Support**: Type definitions for React

## Backend Stack (Current Implementation)

### Core Technologies
- **Runtime**: Node.js
- **API Framework**: Express.js
- **Authentication**: Firebase Admin SDK
- **Database**: Firestore (Firebase)

### API Features
- **Authentication Middleware**: JWT verification
- **Security**: CORS, rate limiting, helmet
- **Error Handling**: Centralized error middleware

## Testing (Planned)
- **Unit Testing**: Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Cypress

## Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel Serverless Functions
- **Database Hosting**: Firebase Cloud Firestore
- **Authentication**: Firebase Authentication
- **Asset Storage**: Firebase Storage

## Development Environment
- **Version Control**: Git
- **Code Editor**: VS Code (recommended)
- **Environment Variables**: .env files
- **Formatting**: ESLint configuration

## External Services
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payment Processing**: Stripe
- **Maps Integration**: Google Maps API (planned)
- **Email Service**: Firebase with custom templates

## Dependencies Overview

### Production Dependencies
```json
{
  "@fortawesome/fontawesome-svg-core": "^6.7.2",
  "@fortawesome/free-brands-svg-icons": "^6.7.2",
  "@fortawesome/react-fontawesome": "^0.2.2",
  "@stripe/react-stripe-js": "^3.5.1",
  "@stripe/stripe-js": "^6.1.0",
  "@tailwindcss/vite": "^4.0.8",
  "firebase": "^11.3.1",
  "firebase-auth-react": "^2.0.12",
  "framer-motion": "^12.4.10",
  "lucide-react": "^0.482.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-hook-form": "^7.54.2",
  "react-icons": "^5.5.0",
  "react-router-dom": "^7.2.0",
  "tailwindcss": "^4.0.8"
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.19.0",
  "@types/react": "^19.0.8",
  "@types/react-dom": "^19.0.3",
  "@vitejs/plugin-react": "^4.3.4",
  "eslint": "^9.19.0",
  "eslint-plugin-react": "^7.37.4",
  "eslint-plugin-react-hooks": "^5.0.0",
  "eslint-plugin-react-refresh": "^0.4.18",
  "globals": "^15.14.0",
  "vite": "^6.1.1"
}
```

## Database Schema

### Users Collection
```
users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - photoURL: string (optional)
  - phoneNumber: string (optional)
  - location: string
  - createdAt: timestamp
  - lastLogin: timestamp
  - emailVerified: boolean
  - authProvider: string
```

### Salons Collection
```
salons/{salonId}
  - id: number
  - name: string
  - description: string
  - location: {
      address: string,
      city: string,
      state: string,
      zip: string,
      coordinates: {
        latitude: number,
        longitude: number
      }
    }
  - rating: number
  - reviewCount: number
  - images: array<string>
  - services: array<{
      id: string,
      name: string,
      description: string,
      price: number,
      duration: number,
      categoryId: string
    }>
  - serviceCategories: array<{
      id: string,
      name: string
    }>
  - hours: {
      monday: { open: string, close: string },
      tuesday: { open: string, close: string },
      // etc for each day
    }
  - amenities: array<string>
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Salonists (Stylists) Collection
```
salonists/{salonistId}
  - id: number
  - salonId: number
  - name: string
  - bio: string
  - specialties: array<string>
  - photoURL: string
  - experience: number (years)
  - services: array<number> (service IDs)
  - availability: {
      monday: array<{ start: string, end: string }>,
      tuesday: array<{ start: string, end: string }>,
      // etc for each day
    }
  - rating: number
  - reviewCount: number
```

### Bookings Collection
```
bookings/{bookingId}
  - userId: string
  - salonId: number
  - salonistId: number
  - services: array<{
      id: number,
      name: string,
      price: number,
      duration: number
    }>
  - date: timestamp
  - startTime: string
  - endTime: string
  - status: string (confirmed, completed, cancelled)
  - totalAmount: number
  - paymentStatus: string
  - paymentMethod: string
  - createdAt: timestamp
  - updatedAt: timestamp
``` 