# EverCut Project Structure

```bash
evercut/
├── client/                     # Frontend application
│   ├── public/
│   │   └── logo/evercut.svg        # Logo asset
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/         # Authentication related components
│   │   │   │   ├── ActionCodeHandler.jsx  
│   │   │   │   ├── EmailVerification.jsx  # Email verification component
│   │   │   │   ├── PrivateRoute.jsx       # Protected route wrapper
│   │   │   │   ├── PublicRoute.jsx        # Public route wrapper
│   │   │   │   └── VerificationStatus.jsx  # Email verification status
│   │   │   ├── common/       # Common UI components
│   │   │   │   ├── Input.jsx    # Form input component
│   │   │   │   ├── Loading.jsx  # Loading indicators
│   │   │   │   └── Modal.jsx    # Modal dialog component
│   │   │   ├── error/        # Error handling components
│   │   │   │   ├── ErrorBoundary.jsx # React error boundary
│   │   │   │   └── ErrorHandler.jsx  # Error notification handler
│   │   │   └── ui/           # UI components
│   │   │       ├── Button.jsx   # Button component
│   │   │       └── GoogleAuthButton.jsx # Google auth button
│   │   ├── contexts/         # React Context providers
│   │   │   └── AuthContext.jsx  # Firebase Auth state management
│   │   ├── firebase/         # Firebase configuration
│   │   │   └── config.js     # Firebase initialization
│   │   ├── pages/            # Page components
│   │   │   ├── ForgotPassword.jsx        # Reset password request page
│   │   │   ├── Home.jsx                  # Protected home page
│   │   │   ├── Login.jsx                 # Login page
│   │   │   ├── ResetPasswordConfirmation.jsx # Password reset page
│   │   │   ├── Signup.jsx                # Registration page
│   │   │   ├── VerifyEmail.jsx           # Email verification page
│   │   │   └── VerifyEmailConfirmation.jsx # Email verification confirmation
│   │   ├── services/            
│   │   │   └── api.js        
│   │   ├── styles/           # Global styles
│   │   │   └── index.css     # Tailwind imports
│   │   ├── utils/            # Utility functions
│   │   │   ├── auth.js       # Auth helper functions
│   │   │   ├── helpers.js    # Common utilities
│   │   │   └── validation.js # Form validation rules
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Application entry point
│   ├── index.html          # HTML entry point
│   ├── eslint.config.js    # ESLint configuration
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
├── server/                   # Backend application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── firebase-admin.js  # Firebase Admin initialization
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.middleware.js    # Firebase token verification
│   │   │   ├── security.middleware.js # Security headers & rate limiting
│   │   │   └── error.middleware.js    # Error handling
│   │   ├── routes/         # API routes
│   │   │   └── protected.routes.js    # Protected API endpoints
│   │   ├── utils/          # Utility functions
│   │   │   └── errors.js   # Error handling utilities
│   │   └── app.js         # Express application setup
│   ├── .env               # Backend environment variables
│   ├── serviceAccountKey.json # Firebase admin credentials
│   └── package.json      # Backend dependencies
│
├── docs/                  # Project documentation
│   ├── api.md            # API endpoints documentation
│   ├── context.md        # Project overview and requirements
│   └── structure.md      # Project structure documentation
│
├── .gitignore           # Git ignore rules
├── README.md            # Project overview
└── package.json         # Root package file
```