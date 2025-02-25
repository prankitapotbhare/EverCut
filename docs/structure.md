# EverCut Project Structure

```bash
evercut/
├── client/                     # Frontend application
│   ├── public/
│   │   └── assets/            # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/         # Authentication related components
│   │   │   │   ├── LoginForm.jsx          # Email/password login
│   │   │   │   ├── SignupForm.jsx         # User registration
│   │   │   │   ├── ForgotPasswordForm.jsx # Password reset
│   │   │   │   ├── GoogleAuthButton.jsx   # Google OAuth
│   │   │   │   ├── AuthGuard.jsx          # Protected route wrapper
│   │   │   │   ├── EmailVerification.jsx  # Email verification handler
│   │   │   │   └── VerificationStatus.jsx # Verification state display
│   │   │   └── common/       # Common UI components
│   │   │       ├── Button.jsx   # Custom button with variants
│   │   │       ├── Input.jsx    # Form input with validation
│   │   │       ├── Modal.jsx    # Popup dialog component
│   │   │       └── Loading.jsx  # Loading indicators
│   │   ├── context/          # React Context providers
│   │   │   └── AuthContext.jsx  # Firebase Auth state management
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useAuth.js       # Firebase auth state hook
│   │   │   ├── useForm.js       # Form handling hook
│   │   │   └── useProtectedRoute.js  # Route protection hook
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx          # Protected home page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Registration page
│   │   │   ├── ForgotPassword.jsx # Reset password page
│   │   │   └── VerifyEmail.jsx   # Email verification page
│   │   ├── firebase/         # Firebase configuration
│   │   │   ├── config.js     # Firebase app initialization
│   │   │   ├── auth.js       # Auth methods and listeners
│   │   │   └── providers.js  # OAuth providers setup
│   │   ├── utils/            # Utility functions
│   │   │   ├── validation.js # Form validation rules
│   │   │   ├── auth.js       # Auth helper functions
│   │   │   └── helpers.js    # Common utility functions
│   │   ├── styles/           # Global styles
│   │   │   └── index.css     # Tailwind and custom styles
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # Application entry point
│   │   └── routes.jsx       # Route definitions with guards
│   ├── .env                 # Frontend environment variables
│   └── package.json         # Frontend dependencies
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