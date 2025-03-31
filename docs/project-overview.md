# EverCut Project Overview

## Application Summary
EverCut is a modern salon booking web application that enables users to find salons, book appointments with stylists, and manage their bookings. The application features a comprehensive authentication system, salon discovery, service selection, appointment scheduling, and payment processing.

## Current Project Status
The application is currently focused on implementing the core salon booking workflow, with the following features actively in development:
- Salon search and discovery
- Stylist selection
- Service selection
- Date and time booking
- Booking management
- Payment processing

## Architecture Overview

### Frontend Architecture
- **Framework**: React 19 with Vite for build tooling
- **Styling**: Tailwind CSS for responsive UI
- **State Management**: React Context API for global state
- **Routing**: React Router v7 for navigation
- **Form Handling**: React Hook Form for form validation
- **Authentication**: Firebase Authentication
- **UI Components**: Custom component library with Tailwind

### Key Frontend Features
1. **Authentication System**
   - Email/password authentication
   - Google OAuth integration
   - Secure password reset flow
   - Email verification system

2. **Salon Discovery**
   - Search functionality with filters
   - Location-based salon recommendations
   - Popular/Featured salon listings
   - Detailed salon profiles

3. **Booking System**
   - Service selection interface
   - Stylist availability checking
   - Calendar-based date selection
   - Time slot management
   - Booking summary and confirmation

4. **Payment Processing**
   - Integration with Stripe for secure payments
   - Multiple payment methods
   - Order summaries and receipts

### Context System
The application uses a structured context system for state management:

1. **AuthContext**
   - Manages user authentication state
   - Handles login, signup, and logout
   - Tracks email verification status

2. **SalonContext**
   - Manages salon data fetching and caching
   - Provides search and filtering capabilities
   - Tracks current salon selection

3. **SalonistContext**
   - Manages stylist data and availability
   - Provides filtering by date and service
   - Tracks stylist selection state

4. **BookingContext**
   - Orchestrates the booking flow
   - Manages selected services, stylist, date and time
   - Provides availability validation
   - Tracks booking state

5. **PaymentContext**
   - Handles payment processing
   - Manages payment methods
   - Tracks payment state

### Component Organization
The frontend components are organized by feature domain:

1. **Authentication Components**
   - Login/Signup forms
   - Password reset flow
   - Email verification

2. **Salon Components**
   - Salon finder/search
   - Salon profile display
   - Service listing and selection

3. **Booking Components**
   - Date selector calendar
   - Time slot picker
   - Stylist selector
   - Booking summary

4. **Payment Components**
   - Payment method selection
   - Credit card input
   - Order confirmation

5. **Common UI Components**
   - Buttons, inputs, modals
   - Loading indicators
   - Error handlers
   - Form elements

## Database Design
Currently, the application uses Firebase's Firestore database with the following collections:

1. **Users**
   - User profiles and preferences
   - Authentication metadata
   - Booking history

2. **Salons**
   - Salon information and metadata
   - Location data
   - Service categories
   - Operating hours
   - Images and promotional content

3. **Salonists (Stylists)**
   - Stylist profiles
   - Expertise and specializations
   - Availability schedule
   - Services offered

4. **Services**
   - Service details
   - Pricing information
   - Duration estimates
   - Category classification

5. **Bookings**
   - Appointment details
   - Selected services
   - Payment status
   - User and salon references

## Development Roadmap
The project is following a phased development approach as outlined in the salon-booking-roadmap.md document:

1. **Authentication & User Management** - Completed
2. **Salon Database & Search System** - In Progress
3. **Salon Details Page** - In Progress
4. **Service Selection & Booking System** - In Progress
5. **Maps Integration & Payment Processing** - Planned
6. **Booking Management & Notifications** - Planned

## Technical Implementation

### Authentication Flow
- User registration with email verification
- Social authentication with Google
- Protected routes for authenticated users
- Persistent login state

### Booking Flow
1. User searches for and selects a salon
2. User browses and selects services
3. User chooses available stylist
4. User selects date and time slot
5. User reviews booking summary
6. User completes payment
7. Confirmation is displayed and email sent

### Data Fetching Strategy
- Context-based data fetching
- Caching for performance optimization
- Loading states for improved UX
- Error handling with user-friendly messages

## UI/UX Design Principles
- Modern, clean interface with consistent styling
- Responsive design for all device sizes
- Clear visual hierarchy and intuitive navigation
- Immediate feedback for user actions
- Streamlined booking process with minimal steps
- Accessibility considerations throughout

## Future Enhancements
- Mobile app development
- Admin dashboard for salon owners
- Analytics and reporting
- Loyalty program integration
- Advanced recommendation system
- Multi-language support 