# EverCut Project Structure

```bash
evercut/
├── client/                     # Frontend application
│   ├── public/                 # Static assets
│   │   └── logo/evercut.svg    # Logo asset
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/           # Authentication related components
│   │   │   │   ├── ActionCodeHandler.jsx  
│   │   │   │   ├── EmailVerification.jsx  # Email verification component
│   │   │   │   ├── PrivateRoute.jsx       # Protected route wrapper
│   │   │   │   ├── PublicRoute.jsx        # Public route wrapper
│   │   │   │   └── VerificationStatus.jsx  # Email verification status
│   │   │   ├── common/         # Common UI components
│   │   │   │   ├── Input.jsx   # Form input component
│   │   │   │   ├── Loading.jsx # Loading indicators
│   │   │   │   └── Modal.jsx   # Modal dialog component
│   │   │   ├── error/          # Error handling components
│   │   │   │   ├── ErrorBoundary.jsx # React error boundary
│   │   │   │   └── ErrorHandler.jsx  # Error notification handler
│   │   │   ├── home/           # Homepage components
│   │   │   ├── payment/        # Payment processing components
│   │   │   ├── salon/          # Salon related components
│   │   │   │   ├── BookingSummary.jsx    # Booking summary display
│   │   │   │   ├── CartSummary.jsx       # Cart summary display
│   │   │   │   ├── DateSelector.jsx      # Date picker component
│   │   │   │   ├── SalonCard.jsx         # Salon preview card
│   │   │   │   ├── SalonFinder.jsx       # Salon search component
│   │   │   │   ├── ServiceCard.jsx       # Service display card
│   │   │   │   ├── ServiceTabs.jsx       # Service category tabs
│   │   │   │   ├── StylistSelector.jsx   # Stylist selection component
│   │   │   │   └── TimeSelector.jsx      # Time slot selection component
│   │   │   └── ui/             # UI components
│   │   │       ├── Button.jsx  # Button component
│   │   │       └── GoogleAuthButton.jsx # Google auth button
│   │   ├── contexts/           # React Context providers
│   │   │   ├── AuthContext.jsx # Firebase Auth state management
│   │   │   ├── BookingContext.jsx # Booking state and logic
│   │   │   ├── PaymentContext.jsx # Payment processing logic
│   │   │   ├── SalonContext.jsx # Salon data management
│   │   │   └── SalonistContext.jsx # Stylist data management
│   │   ├── data/               # Static data and mock data
│   │   ├── firebase/           # Firebase configuration
│   │   │   └── config.js       # Firebase initialization
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Authentication pages
│   │   │   │   ├── ForgotPassword.jsx    # Reset password request page
│   │   │   │   ├── Login.jsx             # Login page
│   │   │   │   ├── ResetPasswordConfirmation.jsx # Password reset page
│   │   │   │   ├── Signup.jsx            # Registration page
│   │   │   │   ├── VerifyEmail.jsx       # Email verification page
│   │   │   │   └── VerifyEmailConfirmation.jsx # Email verification confirmation
│   │   │   ├── salon/          # Salon and booking pages
│   │   │   │   ├── BookingPage.jsx       # Booking flow page
│   │   │   │   └── SalonDetailPage.jsx   # Salon details page
│   │   │   └── Home.jsx        # Main landing page
│   │   ├── services/           # API services
│   │   │   ├── api.js          # Base API configuration
│   │   │   ├── authService.js  # Auth API methods
│   │   │   ├── bookingService.js # Booking API methods
│   │   │   ├── paymentService.js # Payment API methods
│   │   │   └── salonService.js # Salon API methods
│   │   ├── styles/             # Global styles
│   │   │   └── index.css       # Tailwind imports
│   │   ├── utils/              # Utility functions
│   │   │   ├── auth.js         # Auth helper functions
│   │   │   ├── helpers.js      # Common utilities
│   │   │   └── validation.js   # Form validation rules
│   │   ├── assets/             # Static assets
│   │   ├── App.jsx             # Root component with routes
│   │   └── main.jsx            # Application entry point
│   ├── index.html              # HTML entry point
│   ├── .env                    # Environment variables
│   ├── eslint.config.js        # ESLint configuration
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Backend application (structure maintained for reference)
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   └── firebase-admin.js  # Firebase Admin initialization
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.middleware.js    # Firebase token verification
│   │   │   ├── security.middleware.js # Security headers & rate limiting
│   │   │   └── error.middleware.js    # Error handling
│   │   ├── routes/             # API routes
│   │   │   └── protected.routes.js    # Protected API endpoints
│   │   ├── utils/              # Utility functions
│   │   │   └── errors.js       # Error handling utilities
│   │   └── app.js              # Express application setup
│   ├── .env                    # Backend environment variables
│   ├── serviceAccountKey.json  # Firebase admin credentials
│   └── package.json            # Backend dependencies
│
├── docs/                       # Project documentation
│   ├── components.md           # Components documentation
│   ├── context.md              # Project overview and requirements
│   ├── django-postgresql-tech-stack.md # Alternative tech stack
│   ├── express-mongodb-tech-stack.md   # Alternative tech stack
│   ├── image-handling-firebase.md      # Firebase image handling
│   ├── image-handling.md       # Image handling documentation
│   ├── salon-booking-roadmap.md # Development roadmap 
│   ├── structure.md            # Project structure documentation
│   └── theme-management.md     # Styling system documentation
│
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview
└── package.json                # Root package file
```