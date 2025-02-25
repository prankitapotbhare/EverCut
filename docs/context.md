### 1. Project Breakdown
**App Name:** EverCut
**Platform:** Web Application
**Summary:** Modern authentication system with secure login, signup, and password reset functionality
**Primary Use Case:** User authentication and account management
**Authentication Requirements:**
- Email/Password authentication
- Google OAuth integration
- Secure password reset mechanism
- JWT token-based session management

---

### 2. Tech Stack Overview
**Frontend Framework:**
- React + Vite
- Tailwind CSS
- Firebase Authentication (Primary auth provider)

**Backend:**
- Node.js
- Express.js
- Firebase Admin (Token verification only)

**Deployment:**
- Vercel (Frontend)
- Vercel (Backend)

---

### 3. Core Features
1. **User Signup:**
   - Email/password registration
   - Name and location information
   - Password confirmation
   - Terms acceptance
   - Google OAuth signup option
   - Email verification requirement (except Google OAuth)

2. **User Login:**
   - Email/password authentication
   - Google OAuth login

3. **Password Reset:**
   - Firebase password reset flow

4. **Home Page:**
   - Welcome message
   - Authentication options

---

### 4. User Flow
2. **Signup Flow:**
   - Required field collection:
     * Full name
     * Location
     * Email address
     * Password (with confirmation)
     * Terms & policy acceptance
   - Form validation
   - Google OAuth popup option
   - Email verification process:
     * Automatic verification email sent after signup
     * User must verify email before accessing protected routes
     * Resend verification option available
     * Skip verification for Google OAuth users

3. **Login Flow:**
   - Credential validation
   - OAuth authentication
   - Email verification check:
     * Block access if email not verified
     * Redirect to verification page
     * Exception for Google OAuth users

4. **Forgot Password Flow:**
   - Email submission
   - Reset link generation
   - New password setup

---

### 5. Design and UI/UX Guidelines
**Color Palette:**
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Emerald)
- Background: #0F172A (Slate)
- Text: #F8FAFC (Light)

**Typography:**
- Primary Font: Inter
- Font Sizes: 
  - Headings: 1.5rem - 2.5rem
  - Body: 1rem
  - Small: 0.875rem

**UI Components:**
- Buttons: Gradient backgrounds with hover effects
- Forms: Floating labels with validation states
- Modals: Blur backdrop with smooth transitions

**Animations:**
- Smooth page transitions
- Loading state animations

**Accessibility:**
- ARIA labels
- Keyboard navigation
- High contrast mode support

---

### 6. Technical Implementation Approach
**Frontend (React + Vite):**
- React Router for navigation
- React Hook Form for form management and validation
- Firebase Authentication Integration:
  * Complete auth management using Firebase
  * Initialize Firebase with config
  * Use Firebase Auth hooks (useAuth)
  * Handle auth state changes
  * Implement protected routes with AuthGuard
  * Manage Firebase tokens
  * Handle email verification
  * Manage OAuth providers
  * Password reset flow
- Form validation rules:
  * Name: Required
  * Location: Required
  * Email: Required, valid email format
  * Password: Required, minimum security requirements
  * Confirm Password: Must match password
  * Terms: Must be accepted
- Tailwind CSS for styling

**Backend (Express js):**
- RESTful API architecture
- Firebase Admin SDK integration (minimal):
  * Token verification only
  * No direct auth operations
- Security Features:
  * Rate limiting (100 requests per 15 minutes)
  * Helmet for security headers
  * XSS protection
  * HTTP Parameter Pollution prevention
- Authentication Middleware:
  * Verify Firebase ID tokens for API access
  * Extract user claims from token
  * Handle token expiration
- Error Handling:
  * Custom AppError class
  * Centralized error handling
  * Operational vs Programming errors
- Protected Routes:
  * All /api/* routes require valid Firebase token
  * Simple token verification
  * Handle unauthorized access

**Authentication Flow:**
- Frontend Authentication (Firebase):
  * Complete auth state management
  * Handle all auth operations
  * Listen to auth state changes
  * Manage Firebase tokens
  * Handle email verification
  * OAuth provider management
  * Password reset handling
  * User profile updates
- Backend Authentication:
  * Only verify Firebase tokens
  * No auth state management
  * No user management
  * Simple middleware protection
- Protected Routes:
  * Frontend: AuthGuard using Firebase
  * Backend: Simple token verification
  * Handle unauthorized redirects

- Signup (Firebase):
  - Form validation
  - Firebase auth creation
  - Send verification email
  - Redirect to verification page
- Login (Firebase):
  - Email/Password: Firebase authentication
  - Google OAuth: Firebase Google provider
  - Check email verification status
- Password Reset: Firebase password reset flow

**Deployment (Vercel):**
- Automated deployments
- Environment variable management

---

### 7. Development Tools and Setup Instructions
**Tools:**
- VS Code
- Git
- Firebase Console

**Setup Instructions:**
1. Clone the repository:
```bash
git clone https://github.com/username/EverCut.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - VITE_FIREBASE_CONFIG (Frontend)
   - FIREBASE_SERVICE_ACCOUNT_KEY (Backend)
   - PORT (Backend)
   - DATABASE_URL
   - JWT_SECRET

4. Run the development server:
```bash
npm run dev
```

5. Deploy to Vercel:
   - Connect GitHub repository
   - Configure environment variables
