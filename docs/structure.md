# EverCut Project Structure

```bash
evercut/
├── client/                     # Frontend application
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/         # Authentication related components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   └── GoogleAuthButton.jsx
│   │   │   └── common/       # Common UI components
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── Loading.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useFirestore.js
│   │   │   └── useForm.js
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── firebase/        # Firebase configuration and services
│   │   │   ├── config.js
│   │   │   ├── auth.js
│   │   │   └── firestore.js
│   │   ├── utils/           # Utility functions
│   │   │   ├── validation.js
│   │   │   └── helpers.js
│   │   ├── styles/          # Global styles
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── routes.jsx
│   ├── .env
│   └── package.json
│
├── server/                   # Backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── firebase-admin.js
│   │   ├── controllers/    # Route controllers
│   │   │   └── auth.controller.js
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── services/      # Business logic
│   │   │   └── auth.service.js
│   │   ├── utils/         # Utility functions
│   │   │   ├── firebase-admin.js
│   │   │   └── errors.js
│   │   └── app.js        # Express app entry point
│   ├── .env
│   └── package.json
│
├── docs/                 # Documentation
│   ├── api.md
│   ├── context.md
│   └── structure.md
│
├── .gitignore
├── README.md
└── package.json
```