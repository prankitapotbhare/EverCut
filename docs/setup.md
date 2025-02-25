# EverCut Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm
- Git
- Firebase account
- VS Code (recommended)

## Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/username/evercut.git
cd evercut
```

2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Environment Setup

Create `.env` files in both client and server directories:

**Client (.env):**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Server (.env):**
```env
JWT_SECRET=your_jwt_secret
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
```

4. Start Development Servers

**Client:**
```bash
cd client
npm run dev
```

**Server:**
```bash
cd server
npm run dev
```

5. Build for Production

**Client:**
```bash
cd client
npm run build
```

**Server:**
```bash
cd server
npm run build
```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication methods:
   - Email/Password
   - Google
3. Download Firebase Admin SDK credentials
4. Configure Firebase in the application

## Deployment

1. Create Vercel account
2. Link GitHub repository
3. Configure environment variables
4. Deploy frontend and backend separately
