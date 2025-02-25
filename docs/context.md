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

**Backend:**
- Node.js
- Express.js
- Firebase Authentication
- JWT for session management

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
   - Email verification process

3. **Login Flow:**
   - Credential validation
   - OAuth authentication

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
- Firebase Admin SDK integration
- JWT middleware for route protection

**Authentication Flow:**
- Signup:
  - Form validation
  - Firebase auth creation
- Login:
  - Email/Password: Firebase authentication
  - Google OAuth: Firebase Google provider
- Password Reset: Firebase password reset email

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
   - VITE_FIREBASE_CONFIG
   - DATABASE_URL
   - JWT_SECRET

4. Run the development server:
```bash
npm run dev
```

5. Deploy to Vercel:
   - Connect GitHub repository
   - Configure environment variables
