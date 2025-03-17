<div align="center">
  <img src="client/public/logo/evercut.png" alt="EverCut Logo" width="200"/>
  <p>Modern Authentication System with Firebase Integration</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.x-purple)](https://vitejs.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-10.x-orange)](https://firebase.google.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC)](https://tailwindcss.com/)
</div>

## 🌟 Features

- 🔐 Authentication System
  - Email/Password Authentication with Verification
  - Google OAuth Integration
  - Password Reset Flow
  - Protected Routes
  - Firebase Token Management
  - User Profile Management

- 💅 Modern UI/UX
  - Responsive Design with Tailwind CSS
  - Gradient Button Effects
  - Form Validation States
  - Loading Indicators & Animations
  - Modal Dialogs with Focus Trap
  - Smooth Transitions
  - Accessibility Support

- 🛡️ Security Features
  - Email Verification Requirement
  - Secure Password Requirements
  - Protected Routes
  - Authentication State Management
  - Token Handling
  - Firebase Error Parsing

- 🧰 Utility Functions
  - Debounce for Performance Optimization
  - Local Storage Helpers
  - Date Formatting
  - Error Formatting
  - Form Validation Rules

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- npm or yarn
- Git
- Firebase Account
- VS Code (recommended)

## 🚀 Quick Start

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/evercut.git
cd evercut
```

2. **Install Dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Setup**

Create `.env` files in both client and server directories:

**Client (.env)**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Server (.env)**
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

4. **Start Development Servers**

```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm run dev
```

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Components Documentation](docs/components.md)
- [Project Context](docs/context.md)
- [Project Structure](docs/structure.md)
- [Setup Guide](docs/setup.md)

## 🏗️ Project Structure

```
evercut/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React Context providers
│   │   ├── firebase/           # Firebase configuration
│   │   ├── pages/              # Page components
│   │   ├── styles/             # Global styles
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Application entry point
├── server/                     # Backend application
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Utility functions
│   │   └── app.js              # Express application setup
└── docs/                       # Documentation
```

For detailed structure, see [Project Structure](docs/structure.md).

## 🔧 Available Scripts

**Client:**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

**Server:**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
```

## 🚀 Deployment

This project is configured for deployment on Vercel:

1. Frontend: Deploy the `client` directory
2. Backend: Deploy the `server` directory as a serverless function

For detailed deployment instructions, see [Setup Guide](docs/setup.md).

## 🧩 Core Components

- **Authentication**
  - SignupForm - User registration with validation
  - LoginForm - User authentication
  - GoogleAuthButton - OAuth integration
  - EmailVerification - Email verification handling
  - VerificationStatus - Display verification status

- **UI Components**
  - Button - Customizable button with variants
  - Input - Form input with validation states
  - Modal - Dialog with accessibility features
  - Loading - Customizable loading indicators
  - ErrorBoundary - Global error handling

For detailed component documentation, see [Components Documentation](docs/components.md).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourgithub](https://github.com/yourgithub)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)

## 📞 Support

For support, email your@email.com.
