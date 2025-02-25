<div align="center">
  <img src="client/public/evercut.svg" alt="EverCut Logo" width="200"/>
  <h1>EverCut</h1>
  <p>Modern Authentication System with Firebase Integration</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.x-purple)](https://vitejs.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-10.x-orange)](https://firebase.google.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC)](https://tailwindcss.com/)
</div>

## 🌟 Features

- 🔐 Secure Authentication System
  - Email/Password Authentication
  - Google OAuth Integration
  - Password Reset Functionality
  - JWT Token-based Session Management

- 💅 Modern UI/UX
  - Responsive Design
  - Tailwind CSS Styling
  - Form Validation
  - Loading States
  - Error Handling

- 🛠️ Technical Features
  - React + Vite for Frontend
  - Express.js Backend
  - Firebase Integration
  - RESTful API Architecture
  - JWT Authentication

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
JWT_SECRET=your_jwt_secret
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
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
├── client/          # Frontend application
├── server/          # Backend application
└── docs/            # Documentation
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
